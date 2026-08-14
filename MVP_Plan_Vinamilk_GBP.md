# MVP Plan — Hệ thống Quản lý GBP Vinamilk
**Stack: Next.js (App Router) + Supabase + Vercel**

---

## 1. Mục tiêu & phạm vi MVP

**Mục tiêu ngắn hạn:** đủ để chạy **Capability Test 7 ngày** theo brief Vinamilk — 1 Suspended Appeal, 1 Verify, 1 Claim Ownership + tối ưu SEO cơ bản + bàn giao báo cáo.

**Mục tiêu dài hạn (kiến trúc phải sẵn sàng cho việc này, không cần build ngay):** scale lên 560 cửa hàng, nhiều Store Manager, 6.500 review.

Nguyên tắc khi build MVP: **build đúng 4 module đã chốt, nhưng thiết kế schema/API theo hướng multi-store ngay từ đầu** — để tránh phải viết lại khi scale, dù UI ở MVP chỉ cần chạy tốt cho một nhóm nhỏ cửa hàng.

**Trong scope MVP:**
- Auth + phân quyền **Admin / Manager / Store Manager** (+ magic link upload cho Store Manager — không cần tạo 560 account thủ công)
- Module 1: Dashboard (rút gọn — không cần chart phức tạp)
- Module 2: Evidence & Verification Workspace (Kanban + List + Card view, upload video/ảnh)
- Module 3: Bulk NAP & SEO Optimizer (data grid + mass update — chạy được trên tập nhỏ cửa hàng)
- Module 4: Reputation Inbox (list + reply, chưa cần auto-poll phức tạp)
- Kết nối Google Business Profile API cho 3 luồng: Claim, Appeal, Verify + đọc/trả lời review
- **Cloudflare R2** cho video/ảnh bằng chứng (điểm bán hàng chi phí — Egress Fee = $0; xem mục 8)
- Demo UI tĩnh tại `/demo` (không backend) để thuyết trình luồng module

**Ngoài scope MVP (làm sau khi pilot pass):**
- Cron đồng bộ tự động theo giờ (MVP có thể chạy sync thủ công bằng nút bấm)
- Audit log chi tiết, notification realtime, báo cáo nâng cao

---

## 2. Tech stack cụ thể

| Thành phần | Lựa chọn | Ghi chú |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | Server Components + Server Actions, ít viết API route thủ công |
| UI | Tailwind CSS + shadcn/ui | Dựng nhanh Dashboard, Table, Kanban, Form |
| Data | Supabase (Postgres) | Auth, DB, Storage, Row Level Security (RLS) |
| Hosting | Vercel | Next.js native, Preview deploy theo PR |
| Bảng data grid | `<table>` thuần + phân trang (hoặc `@tanstack/react-virtual` cho list dài) | **Lưu ý:** `@tanstack/react-table` chưa cài trong repo hiện tại — cài thêm hoặc dùng table HTML |
| Kanban | `@dnd-kit/core` (đã có) hoặc `@hello-pangea/dnd` | Cho module Evidence & Verification |
| File storage | Cloudflare R2 (MVP) | Video/ảnh bằng chứng — Egress Fee = $0 |
| Chart | Recharts | Cho Dashboard funnel/progress |
| Google API | Business Information API + Account Management API + My Business Q&A/Reviews API | OAuth2, server-side gọi |
| Job/queue đơn giản | Bảng `sync_jobs` trong Postgres + Vercel Cron (hoặc nút "Sync" thủ công ở MVP) | Không cần Redis/queue phức tạp ở giai đoạn này |

---

## 3. Kiến trúc tổng quan

```
Next.js (Vercel)
 ├─ App Router pages (Server Components) ── đọc dữ liệu trực tiếp qua Supabase server client
 ├─ Server Actions ── ghi dữ liệu, gọi Google API, upload file
 ├─ /api/google/oauth/callback ── nhận OAuth callback từ Google
 └─ /api/cron/sync ── (Vercel Cron gọi định kỳ, MVP có thể để trigger thủ công)

Supabase
 ├─ Postgres (stores, verification_requests, evidence, reviews, profiles...)
 ├─ Auth (email/password hoặc Google SSO cho Admin)
 └─ RLS policies theo role + store_id

Cloudflare R2
 └─ Bucket "evidence" — video/ảnh bằng chứng (file_path lưu metadata trên Postgres)

Google Business Profile API (bên ngoài)
```

---

## 4. Database schema (Supabase Postgres)

```sql
-- Người dùng & phân quyền
create table profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  role text not null check (role in ('admin','manager','store_manager')),
  created_at timestamptz default now()
);

-- Cửa hàng (tạo TRƯỚC store_assignments)
create table stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  category text,
  hours jsonb,
  region text,
  gbp_state text not null check (gbp_state in ('claim','suspended','new','verify','verified')),
  workflow_stage text default 'need_evidence'
    check (workflow_stage in ('need_evidence','evidence_uploaded','pending_google','done','optimized')),
  google_place_id text,
  google_location_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Gán Store Manager vào cửa hàng họ quản lý
create table store_assignments (
  user_id uuid references profiles(id),
  store_id uuid references stores(id),
  primary key (user_id, store_id)
);

-- Lịch sử import Data Ingestion (Bước 2 onboarding)
create table store_import_batches (
  id uuid primary key default gen_random_uuid(),
  total_rows int not null,
  tagged_counts jsonb,  -- { claim: 80, suspended: 121, new: 126, verify: 233 }
  imported_at timestamptz default now(),
  imported_by uuid references profiles(id)
);

create table store_status_history (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id),
  old_gbp_state text,
  new_gbp_state text,
  note text,
  changed_by uuid references profiles(id),
  changed_at timestamptz default now()
);

-- Bằng chứng xác thực (file_path trỏ tới Cloudflare R2)
create table evidence (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id),
  type text check (type in ('video','business_license','storefront_photo','interior_photo','other')),
  file_path text not null,       -- path trên Cloudflare R2, KHÔNG lưu binary trong Postgres
  uploaded_by uuid references profiles(id),
  uploaded_at timestamptz default now()
);

-- Checklist giấy tờ theo cửa hàng
create table evidence_checklist_items (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id),
  item_type text check (item_type in ('business_license','storefront_photo','video','interior_photo')),
  checked boolean default false,
  evidence_id uuid references evidence(id)
);

-- Yêu cầu xử lý với Google (Claim / Appeal / Verify)
create table verification_requests (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id),
  type text check (type in ('claim','suspended_appeal','verify')),
  kanban_stage text default 'need_evidence'
    check (kanban_stage in ('need_evidence','evidence_uploaded','pending_google','done')),
  submitted_at timestamptz,
  google_response jsonb,
  notes text,
  created_at timestamptz default now()
);

-- Review
create table reviews (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id),
  google_review_id text unique,
  reviewer_name text,
  rating int,
  comment text,
  replied boolean default false,
  reply_text text,
  replied_at timestamptz,
  fetched_at timestamptz default now()
);

create table reply_templates (
  id uuid primary key default gen_random_uuid(),
  title text,
  body text
);

-- Audit log Mass Update N.A.P
create table nap_change_sets (
  id uuid primary key default gen_random_uuid(),
  store_ids uuid[] not null,
  field text not null,
  old_value text,
  new_value text,
  changed_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- Hàng đợi đồng bộ Google (dùng chung cho sync trạng thái + mass update)
create table sync_jobs (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id),
  job_type text check (job_type in ('status_sync','nap_update','review_fetch','review_reply','claim','appeal','verify')),
  status text default 'queued' check (status in ('queued','processing','success','failed')),
  error_message text,
  created_at timestamptz default now(),
  processed_at timestamptz
);

-- OAuth refresh token mã hoá — chỉ server đọc
create table google_credentials (
  id uuid primary key default gen_random_uuid(),
  encrypted_refresh_token text not null,
  scopes text[] not null,
  connected_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**RLS gợi ý:**
- `admin`: full access mọi bảng (kể cả `google_credentials` qua service role).
- `manager`: đọc toàn bộ `stores` / `reviews`; ghi `verification_requests`, `nap_change_sets`, `evidence`; **không** truy cập `google_credentials`.
- `store_manager`: chỉ `select`/`insert` trên `evidence`, `verification_requests`, `stores` (read-only các field cơ bản) và `reviews` (SELECT only) nơi `store_id` nằm trong `store_assignments` của họ.

```sql
alter table stores enable row level security;

create policy "admin full access" on stores
  for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "manager read all stores" on stores
  for select using (exists (select 1 from profiles where id = auth.uid() and role = 'manager'));

create policy "store manager read own stores" on stores
  for select using (
    exists (
      select 1 from store_assignments sa
      where sa.store_id = stores.id and sa.user_id = auth.uid()
    )
  );
```
(Áp dụng pattern tương tự cho `evidence`, `verification_requests`, `reviews`. `google_credentials` chỉ service role / admin.)

---

## 5. Auth & phân quyền (RBAC)

Ba role, route guard theo prefix:

| Role | Actor | Route prefix (demo) | Phạm vi |
|---|---|---|---|
| `admin` | Vinamilk IT / Chủ hệ thống | `/demo/admin` | 560 cửa hàng + hạ tầng + gán role |
| `manager` | Agency PM / Vận hành | `/demo/manager` | 560 cửa hàng, không hạ tầng / user / `google_credentials` |
| `store_manager` | Quản lý cửa hàng | `/demo/store-manager` | 1 cửa hàng được gán |

1. Dùng **Supabase Auth** (email/password cho Admin/Manager; Store Manager dùng **magic link** upload — không cần tạo 560 account thủ công).
2. Sau khi Admin đăng ký, trigger Postgres function tự tạo dòng trong `profiles` với `role = 'admin'`; Store Manager nhận link token qua SMS/email để upload bằng chứng (không cần account đầy đủ ở MVP).
3. Next.js middleware đọc session + `profiles.role`, chặn prefix: `/admin/*` chỉ `admin`; `/manager/*` `admin` hoặc `manager`; `/store/*` hoặc `/upload/[token]` cho Store Manager.
4. Route `/store/[storeId]` hoặc `/upload/[token]` dành cho Store Manager — giao diện rút gọn, chỉ hiện cửa hàng được gán.

---

## 6. Breakdown theo module

### Module 1 — Master Dashboard (`/dashboard`)
- **Ai thấy:** Admin, Manager. Store Manager không thấy dashboard tổng — chỉ tổng quan 1 cửa hàng.
- Server Component fetch: đếm `stores` theo `gbp_state`, tổng review đã có / 6.500, danh sách store vừa đổi sang `suspended` trong 24h (query `store_status_history`).
- UI: 1 funnel/progress bar (Recharts) + 1 alert widget (list) + stat cards.
- MVP: không cần realtime — refetch mỗi lần load trang là đủ.

### Module 2 — Evidence & Verification Workspace (`/verification`)
- **Ai thấy:** Admin + Manager (Kanban toàn hệ, duyệt + nộp Google). Store Manager: trang upload + checklist của cửa hàng mình.
- **3 view:** Kanban (mặc định) + List + Card — map với `verification_requests.kanban_stage`.
- Upload video/ảnh: client xin presigned URL từ Server Action → upload trực tiếp lên **Cloudflare R2** → lưu `file_path` vào bảng `evidence` trên Supabase.
- Video player: signed URL từ R2 hiển thị in-app, không tải file về máy.
- Evidence Checklist: bảng `evidence_checklist_items` tick chọn giấy tờ đã tải.
- Nút "Nộp lên Google": Server Action gọi Google API (Claim/Appeal/Verify), cập nhật `verification_requests.kanban_stage` + `google_response`. **Admin và Manager** được phép.

### Module 3 — Bulk NAP & SEO Optimizer (`/optimizer`)
- **Ai thấy:** Admin, Manager. Store Manager không thấy.
- Data grid (`<table>` + phân trang, hoặc cài `@tanstack/react-table`) hiển thị `stores`, cho edit inline các field.
- Checkbox chọn nhiều dòng → form "Mass Update" → ghi audit vào `nap_change_sets`.
- Nút "1-Click Sync": tạo nhiều dòng trong `sync_jobs` → Server Action xử lý batch nhỏ → UI poll `sync_jobs`.

### Module 4 — Reputation Inbox (`/reviews`)
- **Ai thấy:** Admin + Manager (Quick Reply). Store Manager: chỉ đọc đánh giá cửa hàng mình.
- List review từ bảng `reviews`, filter theo `rating <= 2` hoặc `replied = false`.
- Nút "Đồng bộ review" (MVP: thủ công) gọi Google Reviews API lưu vào bảng `reviews`.
- Reply: chọn template từ `reply_templates` hoặc gõ tay → Server Action gọi Google Reply API → cập nhật `replied = true`.

### Module 4 — Reputation Inbox (`/reviews`)
- List review từ bảng `reviews`, filter theo `rating <= 2` hoặc `replied = false`.
- Nút "Đồng bộ review" (MVP: thủ công) gọi Google Reviews API lưu vào bảng `reviews`.
- Reply: chọn template từ `reply_templates` hoặc gõ tay → Server Action gọi Google Reply API → cập nhật `replied = true`.

---

## 7. Tích hợp Google Business Profile API

1. **OAuth2 một lần** cho tài khoản quản trị gốc (Admin đăng nhập Google, cấp scope `business.manage`).
2. Route `/api/google/oauth/start` redirect sang Google, `/api/google/oauth/callback` nhận `code`, đổi lấy `access_token` + `refresh_token`.
3. Lưu `refresh_token` **mã hoá** trong bảng riêng (`google_credentials`), chỉ Server Action/route có `service_role` key mới đọc được — **không bao giờ để lộ ra client**.
4. Mọi lời gọi Google API đều thực hiện ở server (Server Action hoặc Route Handler), dùng `access_token` refresh khi hết hạn.
5. Giới hạn tốc độ: xử lý `sync_jobs` theo lô nhỏ (VD 5 request/lần, nghỉ giữa các lô) để tránh vượt quota.

---

## 8. Chiến lược lưu trữ file cho MVP

- **MVP: dùng Cloudflare R2** cho video/ảnh bằng chứng — Egress Fee = $0, phù hợp thuyết trình chi phí (so với AWS S3 ~$150–500/tháng).
- **Supabase Postgres** chỉ lưu metadata (`file_path`, `type`, `store_id`) — không lưu binary.
- **Thiết kế 1 lớp interface trung gian** (`lib/storage.ts`) với `R2StorageProvider` implement `StorageProvider`:

```ts
// lib/storage.ts
export interface StorageProvider {
  upload(path: string, file: File): Promise<string>;
  getSignedUrl(path: string): Promise<string>;
}

// MVP: R2StorageProvider
// Fallback pilot: SupabaseStorageProvider (nếu chưa kịp setup R2)
```

Luồng upload 4 bước:
1. Client xin presigned URL từ Server Action
2. Upload trực tiếp lên R2 (không qua server)
3. Lưu `file_path` vào bảng `evidence` trên Supabase
4. Phát video qua signed URL / CDN

---

## 9. Cấu trúc thư mục Next.js đề xuất

```
app/
  demo/                              # Demo UI tĩnh — không backend
    page.tsx                         # trang bìa: 3 cửa vào theo role
    onboarding/                      # Bước 1–3 thiết lập
    admin/                           # prefix Admin — dashboard, verification, optimizer, reviews, hạ tầng, users
    manager/                         # prefix Manager — dashboard, verification, optimizer, reviews, sync-log
    store-manager/                   # prefix Store Manager — tổng quan, evidence, reviews (chỉ đọc)
  (auth)/login/page.tsx
  dashboard/page.tsx
  verification/page.tsx
  optimizer/page.tsx
  reviews/page.tsx
  store/[storeId]/page.tsx          # giao diện Store Manager
  upload/[token]/page.tsx           # magic link upload (Store Manager)
  api/
    google/oauth/start/route.ts
    google/oauth/callback/route.ts
    cron/sync/route.ts              # Vercel Cron gọi định kỳ (giai đoạn sau MVP)
components/
  dashboard/
  kanban/
  data-grid/
  reviews/
  ui/                                # shadcn components
lib/
  supabase/client.ts                 # browser client
  supabase/server.ts                 # server client (service role khi cần)
  google/client.ts                   # wrapper gọi Google Business Profile API
  storage.ts
  actions/
    verification.actions.ts
    optimizer.actions.ts
    reviews.actions.ts
middleware.ts
```

---

## 10. Timeline đề xuất (khớp roadmap 2–3 tuần đã trình Vinamilk)

| Tuần | Việc chính |
|---|---|
| Tuần 1 | Setup Next.js + Supabase (schema, RLS, Auth) · OAuth Google · UI khung sidebar + 4 route rỗng |
| Tuần 2 | Build đủ 4 module (Dashboard, Verification Kanban + upload, Optimizer grid, Reviews inbox) · nối API Google cho Claim/Appeal/Verify + Reply review |
| Tuần 3 | Chạy thử với 3 case test thật · sửa lỗi · deploy Vercel production · viết hướng dẫn bàn giao |

---

## 11. Biến môi trường cần chuẩn bị

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # chỉ dùng server-side

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=evidence

NEXT_PUBLIC_APP_URL=
```

---

## 12. Rủi ro kỹ thuật cần lưu ý sớm

- **Google API quota/approval**: một số scope của Business Profile API cần Google duyệt thủ công — nên xin quyền truy cập **ngay từ Tuần 1**, đừng để cuối mới làm vì có thể mất vài ngày chờ duyệt.
- **RLS phức tạp dần khi thêm role** — viết test policy sớm (Supabase có SQL editor để test `select ... as authenticated`).
- **Kích thước video xác thực** — cần giới hạn dung lượng upload phía client (nén trước khi upload) để tránh Storage phí phát sinh và tải chậm.
- **Đồng bộ 2 chiều với Google có độ trễ** — trạng thái trong hệ thống có thể lệch vài phút so với Google thực tế; nên hiển thị "cập nhật lần cuối lúc..." để tránh gây hiểu lầm.

---

## 13. Bước bắt đầu ngay (checklist khởi động)

1. `npx create-next-app@latest --typescript --tailwind --app`
2. Tạo project Supabase mới, copy `URL` + `anon key` + `service role key` vào `.env.local`
3. Chạy schema SQL ở mục 4 trong Supabase SQL editor
4. Cài `@supabase/supabase-js`, `@supabase/ssr`, `@dnd-kit/core`, `recharts` (+ `@tanstack/react-table` nếu cần data grid nâng cao)
5. Setup Cloudflare R2 bucket `evidence` + `lib/storage.ts` với R2StorageProvider
6. Đăng ký Google Cloud project → bật **My Business Account Management API** + **My Business Business Information API** → tạo OAuth Client ID → xin quyền truy cập scope (bước hay bị chậm, làm sớm)
7. Build route `/api/google/oauth/callback` trước tiên để có thể test kết nối Google ngay từ đầu, trước khi build UI đầy đủ

---

## 14. Phụ lục — Ma trận phân quyền 3 role

Khớp demo `/demo/admin`, `/demo/manager`, `/demo/store-manager` và schema mục 4.

| Module | Admin | Manager | Store Manager |
|---|---|---|---|
| Master Dashboard | Đầy đủ | Đầy đủ | Không (chỉ tổng quan 1 cửa hàng) |
| Xác thực & Bằng chứng | Duyệt + nộp Google | Duyệt + nộp Google | Upload evidence cửa hàng mình |
| Tối ưu N.A.P & SEO | Đầy đủ | Đầy đủ | Không |
| Hộp thư Đánh giá | Quick Reply | Quick Reply | Chỉ đọc |
| Nhật ký đồng bộ | Đầy đủ | Chỉ đọc | Không |
| Kiến trúc / Supabase / R2 | Đầy đủ | Không | Không |
| Kết nối Google (OAuth) | Đầy đủ | Không (`google_credentials`) | Không |
| Người dùng & Phân quyền | Đầy đủ | Không | Không |

**Sửa thủ công `PHƯƠNG ÁN THIẾT KẾ UI.docx` — Bước 3:**

Hiện gộp một dòng: *«Admin/Manager (Vinamilk & Agency): Nhìn thấy toàn bộ Master Dashboard, có quyền phê duyệt và đẩy dữ liệu lên Google.»*

Tách thành hai dòng để khớp MVP + demo:

- **Admin (Vinamilk IT / Chủ hệ thống):** Master Dashboard, phê duyệt và đẩy dữ liệu lên Google, cấu hình OAuth/hạ tầng (Supabase, R2), gán role.
- **Manager (Agency PM / Vận hành):** Master Dashboard, phê duyệt và đẩy dữ liệu lên Google. Không cấu hình hạ tầng, không quản lý user.
- **Store Manager (Quản lý cửa hàng):** giữ nguyên — giao diện rút gọn, chỉ cửa hàng của mình, tải video và giấy tờ.

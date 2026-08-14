# Vinamilk GBP Demo

Demo UI/UX tĩnh cho hệ thống quản lý **Google Business Profile** của Vinamilk (~560 cửa hàng). Không gọi backend, không cần `.env`.

## Vai trò

| Role | Đường dẫn |
|------|-----------|
| Admin | `/demo/admin` |
| Manager | `/demo/manager` |
| Store Manager | `/demo/store-manager` |
| Onboarding | `/demo/onboarding` |

Trang gốc `/` tự động chuyển sang `/demo`.

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Cursor MCP (GitHub + Vercel riêng — không dùng chung CRM)

Chỉ project này có GitHub/Vercel MCP. CRM (`real-estate-crm`) không bị ảnh hưởng.

Trong [`.cursor/mcp.json`](.cursor/mcp.json):

| Server | Endpoint |
|--------|----------|
| `github-vinamilk` | `https://api.githubcopilot.com/mcp/` |
| `vercel-vinamilk` | `https://mcp.vercel.com` |

**Login bằng tài khoản GitHub/Vercel MỚI**, không dùng account CRM:

1. Tạo account GitHub mới (hoặc org mới) và account Vercel mới nếu chưa có.
2. **Cursor Settings → Tools & MCP**.
3. Bấm **Connect / Needs login** trên `github-vinamilk` và `vercel-vinamilk`.
4. Trên trình duyệt, đăng nhập đúng account mới (không chọn account CRM).

Nếu GitHub báo lỗi auth: tạo PAT trên account GitHub mới, đặt biến môi trường `GITHUB_PERSONAL_ACCESS_TOKEN`, rồi thêm `headers.Authorization` vào `github-vinamilk`.

## Deploy GitHub + Vercel

1. Tạo repo GitHub mới (ví dụ `vinamilk-demo`).
2. Trong thư mục này:

```bash
git init
git add .
git commit -m "Initial commit: Vinamilk GBP demo"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

3. Vào [Vercel](https://vercel.com) → **Add New Project** → Import repo vừa tạo.
4. Framework Preset: **Next.js**. Không cần Environment Variables.
5. Deploy.

## Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- lucide-react, recharts, @dnd-kit
- Export Excel/PNG/PDF: exceljs, html2canvas, jspdf

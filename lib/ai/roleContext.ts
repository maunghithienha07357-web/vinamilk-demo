import { DEMO_COST_COMPARISON, DEMO_R2_STATS, DEMO_VERCEL_STATS } from "@/features/demo/constants/demoCosts";
import {
  DEMO_SAMPLE_USERS,
  DEMO_PERMISSION_MATRIX,
} from "@/features/demo/constants/demoPermissionMatrix";
import { DEMO_REVIEWS } from "@/features/demo/constants/demoReviews";
import { DEMO_ROLE_META, type DemoRole } from "@/features/demo/constants/demoRoles";
import { DEMO_SCHEMA_TABLES, DEMO_SUPABASE_STATS } from "@/features/demo/constants/demoSchema";
import { DEMO_SYNC_JOBS } from "@/features/demo/constants/demoSyncJobs";

export const DEMO_ROLES: DemoRole[] = ["admin", "manager", "store_manager"];

export function isDemoRole(value: unknown): value is DemoRole {
  return value === "admin" || value === "manager" || value === "store_manager";
}

export type StoreSnapshot = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  category: string | null;
  hours: string | null;
  website: string | null;
  region: string;
  gbp_state: string;
  kanban_stage: string;
  sync_status: string;
  google_place_id: string | null;
  lat: number;
  lng: number;
  rating: number | null;
  review_count: number | null;
  one_star_count: number | null;
  evidence_status: string | null;
  reason: string | null;
  assigned_to_store_manager: boolean;
};

const MANAGER_STORE_KEYS = [
  "id",
  "name",
  "address",
  "phone",
  "hours",
  "category",
  "gbp_state",
  "kanban_stage",
  "sync_status",
  "rating",
  "review_count",
  "one_star_count",
  "evidence_status",
  "reason",
] as const;

type ManagerStore = Pick<StoreSnapshot, (typeof MANAGER_STORE_KEYS)[number]>;

function pickManagerStore(store: StoreSnapshot): ManagerStore {
  return {
    id: store.id,
    name: store.name,
    address: store.address,
    phone: store.phone,
    hours: store.hours,
    category: store.category,
    gbp_state: store.gbp_state,
    kanban_stage: store.kanban_stage,
    sync_status: store.sync_status,
    rating: store.rating,
    review_count: store.review_count,
    one_star_count: store.one_star_count,
    evidence_status: store.evidence_status,
    reason: store.reason,
  };
}

function reviewsFor(storeIds: string[]) {
  const allowed = new Set(storeIds);
  return DEMO_REVIEWS.filter((r) => allowed.has(r.storeId)).map((r) => ({
    store: r.storeName,
    reviewer: r.reviewerName,
    rating: r.rating,
    comment: r.comment,
    replied: r.replied,
    reply: r.replyText ?? null,
  }));
}

function countsBy(stores: { gbp_state: string }[]) {
  const counts: Record<string, number> = {};
  for (const s of stores) {
    counts[s.gbp_state] = (counts[s.gbp_state] ?? 0) + 1;
  }
  return counts;
}

export function buildRoleContext(role: DemoRole, stores: StoreSnapshot[]): {
  system: string;
  storeCount: number;
  scopeLabel: string;
} {
  const meta = DEMO_ROLE_META[role];
  let payload: unknown;
  let extraRules: string;

  if (role === "admin") {
    payload = {
      stores,
      stats: {
        total: stores.length,
        byGbpState: countsBy(stores),
        reviewCount: stores.reduce((n, s) => n + Number(s.review_count ?? 0), 0),
        oneStarCount: stores.reduce((n, s) => n + Number(s.one_star_count ?? 0), 0),
      },
      reviews: reviewsFor(stores.map((s) => s.id)),
      syncJobs: DEMO_SYNC_JOBS,
      users: DEMO_SAMPLE_USERS,
      permissionMatrix: DEMO_PERMISSION_MATRIX.map((row) => ({
        module: row.module,
        admin: row.levels.admin,
        manager: row.levels.manager,
        storeManager: row.levels.store_manager,
        note: row.note,
      })),
      infrastructure: {
        supabase: DEMO_SUPABASE_STATS,
        schemaTables: DEMO_SCHEMA_TABLES,
        vercel: DEMO_VERCEL_STATS,
        r2: DEMO_R2_STATS,
        costComparison: DEMO_COST_COMPARISON,
      },
    };
    extraRules =
      "Bạn được xem toàn bộ 5 cửa hàng (kể cả google_place_id, tọa độ) và dữ liệu hạ tầng (Supabase, R2, chi phí, user).";
  } else if (role === "manager") {
    const ops = stores.map(pickManagerStore);
    payload = {
      stores: ops,
      stats: {
        total: ops.length,
        byGbpState: countsBy(ops),
        reviewCount: ops.reduce((n, s) => n + Number(s.review_count ?? 0), 0),
        oneStarCount: ops.reduce((n, s) => n + Number(s.one_star_count ?? 0), 0),
      },
      reviews: reviewsFor(ops.map((s) => s.id)),
    };
    extraRules =
      "Bạn được xem 5 cửa hàng ở mức vận hành (N.A.P, GBP, đánh giá, bằng chứng). KHÔNG được nói về hạ tầng (Supabase schema, Cloudflare R2, chi phí AWS/Vercel), google_place_id, danh sách user, hoặc cấu hình OAuth. Nếu bị hỏi những chủ đề đó, trả lời rằng Manager không có quyền truy cập.";
  } else {
    const mine = stores.find((s) => s.assigned_to_store_manager) ?? null;
    payload = mine
      ? {
          assignedStore: pickManagerStore(mine),
          reviews: reviewsFor([mine.id]),
        }
      : { assignedStore: null, reviews: [] };
    extraRules =
      "Bạn CHỈ được nói về cửa hàng được gán (Vinamilk Trải nghiệm — 11 Bùi Bằng Đoàn). Không nêu tên, địa chỉ, số liệu hay đánh giá của cửa hàng khác. Không đưa số liệu tổng 5 cửa hàng. Không nói về Optimizer, Mass Update, hạ tầng, user. Nếu bị hỏi cửa hàng khác hoặc tổng quan hệ thống, trả lời rõ: không có quyền truy cập.";
  }

  const system = [
    "Bạn là trợ lý AI của Vinamilk GBP Platform (demo 5 cửa hàng cụm Quận 7).",
    `Vai trò người hỏi: ${meta.label} — ${meta.actor}.`,
    `Phạm vi: ${meta.scope}.`,
    extraRules,
    "Chỉ trả lời dựa trên dữ liệu JSON dưới đây. Không bịa số liệu. Nếu thiếu dữ liệu, nói chưa có trong snapshot — Admin cần bấm Đồng bộ database.",
    "Trả lời tiếng Việt, ngắn gọn, có gạch đầu dòng khi liệt kê.",
    "",
    "--- DỮ LIỆU ---",
    JSON.stringify(payload),
  ].join("\n");

  const storeCount =
    role === "store_manager"
      ? stores.some((s) => s.assigned_to_store_manager)
        ? 1
        : 0
      : stores.length;

  return { system, storeCount, scopeLabel: meta.scope };
}

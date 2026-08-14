export type DemoSchemaTable = {
  name: string;
  description: string;
  keyColumns: string[];
  storageNote?: string;
};

export const DEMO_SCHEMA_TABLES: DemoSchemaTable[] = [
  {
    name: "profiles",
    description: "Người dùng & phân quyền (Admin / Manager / Store Manager)",
    keyColumns: ["id", "full_name", "role"],
  },
  {
    name: "stores",
    description: "5 cửa hàng Giấc Mơ Sữa Việt (cụm Q7) — metadata + lat/lng map",
    keyColumns: ["id", "name", "gbp_state", "workflow_stage", "google_place_id"],
  },
  {
    name: "store_assignments",
    description: "Gán Store Manager vào cửa hàng",
    keyColumns: ["user_id", "store_id"],
  },
  {
    name: "store_import_batches",
    description: "Lịch sử import Data Ingestion (Bước 2)",
    keyColumns: ["id", "total_rows", "tagged_counts", "imported_at"],
  },
  {
    name: "evidence",
    description: "Metadata bằng chứng — file_path trỏ tới R2",
    keyColumns: ["id", "store_id", "type", "file_path"],
    storageNote: "file_path = đường dẫn trên Cloudflare R2, không lưu binary trong Postgres",
  },
  {
    name: "evidence_checklist_items",
    description: "Checklist giấy tờ theo cửa hàng",
    keyColumns: ["id", "store_id", "item_type", "checked"],
  },
  {
    name: "verification_requests",
    description: "Yêu cầu Claim / Appeal / Verify",
    keyColumns: ["id", "store_id", "type", "kanban_stage"],
  },
  {
    name: "reviews",
    description: "Đánh giá từ Google — text only",
    keyColumns: ["id", "store_id", "rating", "comment", "replied"],
  },
  {
    name: "reply_templates",
    description: "Template trả lời nhanh",
    keyColumns: ["id", "title", "body"],
  },
  {
    name: "sync_jobs",
    description: "Hàng đợi đồng bộ Google",
    keyColumns: ["id", "store_id", "job_type", "status"],
  },
  {
    name: "nap_change_sets",
    description: "Audit log Mass Update N.A.P",
    keyColumns: ["id", "store_ids", "field", "old_value", "new_value"],
  },
  {
    name: "google_credentials",
    description: "Refresh token mã hoá — chỉ server đọc",
    keyColumns: ["id", "encrypted_refresh_token", "scopes"],
    storageNote: "Service role only — không bao giờ expose ra client",
  },
];

export const DEMO_RLS_POLICIES = [
  {
    table: "stores",
    admin: "Full access (SELECT, INSERT, UPDATE, DELETE)",
    manager: "SELECT + UPDATE metadata (toàn bộ cửa hàng)",
    storeManager: "SELECT only — WHERE store_id IN store_assignments",
  },
  {
    table: "evidence",
    admin: "Full access",
    manager: "SELECT + INSERT — toàn bộ cửa hàng",
    storeManager: "SELECT + INSERT — cửa hàng được gán",
  },
  {
    table: "verification_requests",
    admin: "Full access",
    manager: "SELECT + INSERT + UPDATE kanban_stage",
    storeManager: "SELECT + INSERT — cửa hàng được gán",
  },
  {
    table: "reviews",
    admin: "Full access",
    manager: "SELECT + UPDATE reply",
    storeManager: "SELECT only — cửa hàng được gán",
  },
  {
    table: "google_credentials",
    admin: "Service role only — không expose client",
    manager: "Không truy cập",
    storeManager: "Không truy cập",
  },
];

export const DEMO_SUPABASE_STATS = {
  plan: "Supabase Pro",
  storage: "100 GB (text/metadata)",
  estimatedRows: "~2.5M rows at scale",
  auth: "Email/password + Google SSO (Admin)",
};

import type { DemoRole } from "./demoRoles";

export type PermissionLevel = "full" | "read" | "own" | "none";

export type PermissionRow = {
  id: string;
  module: string;
  levels: Record<DemoRole, PermissionLevel>;
  note: string;
};

export const PERMISSION_LEVEL_LABELS: Record<PermissionLevel, string> = {
  full: "Đầy đủ",
  read: "Chỉ đọc",
  own: "Cửa hàng của mình",
  none: "Không",
};

export const DEMO_PERMISSION_MATRIX: PermissionRow[] = [
  {
    id: "dashboard",
    module: "Master Dashboard",
    levels: { admin: "full", manager: "full", store_manager: "none" },
    note: "Store Manager chỉ thấy tổng quan 1 cửa hàng",
  },
  {
    id: "verification",
    module: "Xác thực & Bằng chứng",
    levels: { admin: "full", manager: "full", store_manager: "own" },
    note: "Store Manager upload evidence; Admin/Manager duyệt + nộp Google",
  },
  {
    id: "optimizer",
    module: "Tối ưu N.A.P & SEO",
    levels: { admin: "full", manager: "full", store_manager: "none" },
    note: "Mass Update ghi nap_change_sets",
  },
  {
    id: "reviews",
    module: "Hộp thư Đánh giá",
    levels: { admin: "full", manager: "full", store_manager: "read" },
    note: "Store Manager SELECT only — không Quick Reply",
  },
  {
    id: "sync-log",
    module: "Nhật ký đồng bộ",
    levels: { admin: "full", manager: "read", store_manager: "none" },
    note: "Manager xem status job, không cấu hình quota",
  },
  {
    id: "architecture",
    module: "Kiến trúc hệ thống",
    levels: { admin: "full", manager: "none", store_manager: "none" },
    note: "Chỉ Admin thấy hạ tầng",
  },
  {
    id: "database",
    module: "Cơ sở dữ liệu (Supabase)",
    levels: { admin: "full", manager: "none", store_manager: "none" },
    note: "Schema + RLS — Admin only",
  },
  {
    id: "storage",
    module: "Kho bằng chứng (Cloudflare R2)",
    levels: { admin: "full", manager: "none", store_manager: "none" },
    note: "Store Manager upload qua presigned URL, không vào trang R2",
  },
  {
    id: "google-connection",
    module: "Kết nối Google / OAuth",
    levels: { admin: "full", manager: "none", store_manager: "none" },
    note: "google_credentials — service role only, UI Admin",
  },
  {
    id: "users",
    module: "Người dùng & Phân quyền",
    levels: { admin: "full", manager: "none", store_manager: "none" },
    note: "Gán role + store_assignments",
  },
];

export const DEMO_SAMPLE_USERS = [
  {
    name: "Admin Vinamilk",
    email: "admin@vinamilk.com.vn",
    role: "admin" as const,
    stores: "5 cửa hàng Q7",
  },
  {
    name: "PM Agency",
    email: "pm@agency.com",
    role: "manager" as const,
    stores: "5 cửa hàng Q7",
  },
  {
    name: "Nguyễn Văn A",
    email: "bbd@vinamilk.com",
    role: "store_manager" as const,
    stores: "11 Bùi Bằng Đoàn",
  },
];

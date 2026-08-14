export type DemoRole = "admin" | "manager" | "store_manager";

export type DemoRoleMeta = {
  id: DemoRole;
  label: string;
  actor: string;
  basePath: string;
  description: string;
  scope: string;
  capabilities: string[];
  restrictions: string[];
};

export const DEMO_ROLE_META: Record<DemoRole, DemoRoleMeta> = {
  admin: {
    id: "admin",
    label: "Admin",
    actor: "Vinamilk IT / Chủ hệ thống",
    basePath: "/demo/admin",
    description:
      "Toàn quyền Master Dashboard, cấu hình OAuth/hạ tầng, phê duyệt và đẩy dữ liệu lên Google, gán role.",
    scope: "Toàn bộ 560 cửa hàng + hạ tầng (Supabase, R2, Google OAuth)",
    capabilities: [
      "Xem Master Dashboard toàn hệ thống",
      "Duyệt bằng chứng và nộp Claim / Appeal / Verify lên Google",
      "Mass Update N.A.P & 1-Click Sync",
      "Trả lời đánh giá toàn hệ thống",
      "Cấu hình OAuth, xem schema Supabase, kho R2, nhật ký đồng bộ",
      "Gán role Admin / Manager / Store Manager",
    ],
    restrictions: ["Không hạn chế trên demo — Admin là chủ hệ thống"],
  },
  manager: {
    id: "manager",
    label: "Manager",
    actor: "Agency PM / Vận hành",
    basePath: "/demo/manager",
    description:
      "Vận hành 560 cửa hàng: duyệt bằng chứng, tối ưu N.A.P, trả lời đánh giá, đẩy dữ liệu lên Google.",
    scope: "Toàn bộ 560 cửa hàng — không thấy hạ tầng và quản lý user",
    capabilities: [
      "Xem Dashboard vận hành",
      "Duyệt bằng chứng và nộp lên Google (đúng PHƯƠNG ÁN THIẾT KẾ UI)",
      "Mass Update N.A.P & 1-Click Sync",
      "Trả lời đánh giá toàn hệ thống",
      "Xem nhật ký đồng bộ (chỉ đọc)",
    ],
    restrictions: [
      "Không thấy Kiến trúc / Supabase / Cloudflare R2",
      "Không cấu hình Kết nối Google (google_credentials)",
      "Không quản lý người dùng & phân quyền",
    ],
  },
  store_manager: {
    id: "store_manager",
    label: "Store Manager",
    actor: "Quản lý cửa hàng",
    basePath: "/demo/store-manager",
    description:
      "Giao diện rút gọn — chỉ cửa hàng được gán, tải video mặt tiền và giấy tờ. Magic link, không cần tạo 560 account.",
    scope: "1 cửa hàng được gán (demo: Vinamilk TP.HCM — CH 42)",
    capabilities: [
      "Xem tổng quan cửa hàng của mình",
      "Tải video mặt tiền + giấy tờ (INSERT evidence)",
      "Xem trạng thái hồ sơ Google của cửa hàng mình",
      "Xem đánh giá cửa hàng (chỉ đọc)",
    ],
    restrictions: [
      "Không thấy dashboard tổng 560 cửa hàng",
      "Không Optimizer / Mass Update",
      "Không hạ tầng, không quản lý user",
      "Không trả lời đánh giá (SELECT only trên reviews)",
    ],
  },
};

export const DEMO_ROLE_LIST: DemoRole[] = ["admin", "manager", "store_manager"];

export function roleFromPathname(pathname: string): DemoRole | null {
  if (pathname === "/demo/admin" || pathname.startsWith("/demo/admin/")) return "admin";
  if (pathname === "/demo/manager" || pathname.startsWith("/demo/manager/")) return "manager";
  if (pathname === "/demo/store-manager" || pathname.startsWith("/demo/store-manager/")) {
    return "store_manager";
  }
  return null;
}

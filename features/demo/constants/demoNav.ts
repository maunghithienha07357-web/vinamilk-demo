import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BookOpen,
  Bot,
  ClipboardList,
  Cloud,
  Database,
  FileBarChart,
  LayoutDashboard,
  Link2,
  MapPin,
  MessageSquare,
  Settings,
  Shield,
  Store,
  Upload,
  Users,
} from "lucide-react";
import type { DemoRole } from "./demoRoles";
import { DEMO_ROLE_META, roleFromPathname } from "./demoRoles";

export type DemoNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "danger" | "warning";
};

export type DemoNavGroup = {
  id: string;
  label: string;
  items: DemoNavItem[];
};

export type DemoFlowStep = {
  id: string;
  label: string;
  href: string;
};

export const DEMO_ROLE_NAV: Record<DemoRole, DemoNavGroup[]> = {
  admin: [
    {
      id: "ops",
      label: "ĐIỀU HÀNH",
      items: [
        {
          id: "dashboard",
          label: "Master Dashboard",
          href: "/demo/admin/dashboard",
          icon: LayoutDashboard,
          badge: "1 cảnh báo",
          badgeVariant: "danger",
        },
      ],
    },
    {
      id: "gbp",
      label: "VẬN HÀNH GBP",
      items: [
        {
          id: "verification",
          label: "Xác thực & Bằng chứng",
          href: "/demo/admin/verification",
          icon: Shield,
          badge: "1",
          badgeVariant: "warning",
        },
        {
          id: "optimizer",
          label: "Tối ưu N.A.P & SEO",
          href: "/demo/admin/optimizer",
          icon: MapPin,
        },
        {
          id: "reviews",
          label: "Hộp thư Đánh giá",
          href: "/demo/admin/reviews",
          icon: MessageSquare,
          badge: "17",
          badgeVariant: "default",
        },
      ],
    },
    {
      id: "infra",
      label: "HẠ TẦNG & DỮ LIỆU",
      items: [
        {
          id: "architecture",
          label: "Kiến trúc hệ thống",
          href: "/demo/admin/architecture",
          icon: Activity,
        },
        {
          id: "database",
          label: "Cơ sở dữ liệu (Supabase)",
          href: "/demo/admin/database",
          icon: Database,
        },
        {
          id: "storage",
          label: "Kho bằng chứng (Cloudflare R2)",
          href: "/demo/admin/storage",
          icon: Cloud,
        },
        {
          id: "google-connection",
          label: "Kết nối Google",
          href: "/demo/admin/google-connection",
          icon: Link2,
        },
        {
          id: "sync-log",
          label: "Nhật ký đồng bộ",
          href: "/demo/admin/sync-log",
          icon: Activity,
        },
        {
          id: "ai",
          label: "Cấu hình AI",
          href: "/demo/admin/ai",
          icon: Bot,
        },
      ],
    },
    {
      id: "system",
      label: "HỆ THỐNG",
      items: [
        {
          id: "users",
          label: "Người dùng & Phân quyền",
          href: "/demo/admin/users",
          icon: Users,
        },
        {
          id: "settings",
          label: "Thiết lập OAuth",
          href: "/demo/onboarding",
          icon: Settings,
        },
      ],
    },
  ],
  manager: [
    {
      id: "ops",
      label: "ĐIỀU HÀNH",
      items: [
        {
          id: "dashboard",
          label: "Dashboard vận hành",
          href: "/demo/manager/dashboard",
          icon: LayoutDashboard,
          badge: "1 cảnh báo",
          badgeVariant: "danger",
        },
      ],
    },
    {
      id: "gbp",
      label: "VẬN HÀNH GBP",
      items: [
        {
          id: "verification",
          label: "Xác thực & Bằng chứng",
          href: "/demo/manager/verification",
          icon: Shield,
          badge: "1",
          badgeVariant: "warning",
        },
        {
          id: "optimizer",
          label: "Tối ưu N.A.P & SEO",
          href: "/demo/manager/optimizer",
          icon: MapPin,
        },
        {
          id: "reviews",
          label: "Hộp thư Đánh giá",
          href: "/demo/manager/reviews",
          icon: MessageSquare,
          badge: "17",
          badgeVariant: "default",
        },
      ],
    },
    {
      id: "stores",
      label: "QUẢN LÝ CỬA HÀNG",
      items: [
        {
          id: "store-list",
          label: "Danh sách cửa hàng",
          href: "/demo/manager/stores",
          icon: Store,
        },
      ],
    },
    {
      id: "reports",
      label: "BÁO CÁO",
      items: [
        {
          id: "weekly-report",
          label: "Báo cáo tiến độ tuần",
          href: "/demo/manager/reports",
          icon: FileBarChart,
        },
      ],
    },
    {
      id: "track",
      label: "THEO DÕI",
      items: [
        {
          id: "sync-log",
          label: "Nhật ký đồng bộ",
          href: "/demo/manager/sync-log",
          icon: Activity,
        },
      ],
    },
  ],
  store_manager: [
    {
      id: "store",
      label: "CỬA HÀNG CỦA TÔI",
      items: [
        {
          id: "overview",
          label: "Tổng quan cửa hàng",
          href: "/demo/store-manager",
          icon: Store,
        },
        {
          id: "evidence",
          label: "Tải bằng chứng",
          href: "/demo/store-manager/evidence",
          icon: Upload,
        },
        {
          id: "reviews",
          label: "Đánh giá cửa hàng",
          href: "/demo/store-manager/reviews",
          icon: MessageSquare,
        },
      ],
    },
    {
      id: "gbp-info",
      label: "THÔNG TIN GBP",
      items: [
        {
          id: "nap",
          label: "Thông tin N.A.P",
          href: "/demo/store-manager/nap",
          icon: MapPin,
        },
        {
          id: "status",
          label: "Trạng thái hồ sơ",
          href: "/demo/store-manager/status",
          icon: ClipboardList,
        },
      ],
    },
    {
      id: "help",
      label: "HỖ TRỢ",
      items: [
        {
          id: "guide",
          label: "Hướng dẫn nộp hồ sơ",
          href: "/demo/store-manager/guide",
          icon: BookOpen,
        },
      ],
    },
  ],
};

export const DEMO_ROLE_FLOW: Record<DemoRole, DemoFlowStep[]> = {
  admin: [
    { id: "landing", label: "Tổng quan Admin", href: "/demo/admin" },
    { id: "dashboard", label: "Module 1: Dashboard", href: "/demo/admin/dashboard" },
    { id: "verification", label: "Module 2: Xác thực", href: "/demo/admin/verification" },
    { id: "optimizer", label: "Module 3: N.A.P & SEO", href: "/demo/admin/optimizer" },
    { id: "reviews", label: "Module 4: Đánh giá", href: "/demo/admin/reviews" },
    { id: "architecture", label: "Kiến trúc Backend", href: "/demo/admin/architecture" },
    { id: "database", label: "Supabase", href: "/demo/admin/database" },
    { id: "storage", label: "Cloudflare R2", href: "/demo/admin/storage" },
    { id: "users", label: "Người dùng & Phân quyền", href: "/demo/admin/users" },
  ],
  manager: [
    { id: "landing", label: "Tổng quan Manager", href: "/demo/manager" },
    { id: "dashboard", label: "Dashboard vận hành", href: "/demo/manager/dashboard" },
    { id: "stores", label: "Danh sách cửa hàng", href: "/demo/manager/stores" },
    { id: "verification", label: "Xác thực", href: "/demo/manager/verification" },
    { id: "optimizer", label: "N.A.P & SEO", href: "/demo/manager/optimizer" },
    { id: "reviews", label: "Đánh giá", href: "/demo/manager/reviews" },
    { id: "reports", label: "Báo cáo tuần", href: "/demo/manager/reports" },
    { id: "sync-log", label: "Nhật ký đồng bộ", href: "/demo/manager/sync-log" },
  ],
  store_manager: [
    { id: "overview", label: "Tổng quan cửa hàng", href: "/demo/store-manager" },
    { id: "nap", label: "Thông tin N.A.P", href: "/demo/store-manager/nap" },
    { id: "status", label: "Trạng thái hồ sơ", href: "/demo/store-manager/status" },
    { id: "evidence", label: "Tải bằng chứng", href: "/demo/store-manager/evidence" },
    { id: "reviews", label: "Đánh giá cửa hàng", href: "/demo/store-manager/reviews" },
    { id: "guide", label: "Hướng dẫn nộp hồ sơ", href: "/demo/store-manager/guide" },
  ],
};

export const DEMO_ONBOARDING_FLOW: DemoFlowStep[] = [
  { id: "cover", label: "Trang bìa", href: "/demo" },
  { id: "onboarding", label: "Bước 1: Ủy quyền API", href: "/demo/onboarding" },
  { id: "consent", label: "Google Consent", href: "/demo/onboarding/consent" },
  { id: "import", label: "Bước 2: Data Ingestion", href: "/demo/onboarding/import" },
  { id: "roles", label: "Bước 3: Phân quyền", href: "/demo/onboarding/roles" },
];

/** Luồng thuyết trình trang bìa: onboarding rồi vào Admin. */
export const DEMO_FLOW_STEPS: DemoFlowStep[] = [
  ...DEMO_ONBOARDING_FLOW,
  { id: "admin", label: "Vào hệ thống Admin", href: "/demo/admin" },
];

export function getDemoNextStep(
  pathname: string,
  role?: DemoRole | null,
): { label: string; href: string } | null {
  const resolved = role ?? roleFromPathname(pathname);
  const steps = resolved ? DEMO_ROLE_FLOW[resolved] : DEMO_ONBOARDING_FLOW;
  const idx = steps.findIndex((s) => s.href === pathname);
  if (idx < 0 || idx >= steps.length - 1) return null;
  const next = steps[idx + 1];
  return { label: next.label, href: next.href };
}

export function getDemoPageTitle(pathname: string, role?: DemoRole | null): string {
  const resolved = role ?? roleFromPathname(pathname);
  if (resolved) {
    for (const group of DEMO_ROLE_NAV[resolved]) {
      const item = group.items.find((i) => i.href === pathname);
      if (item) return item.label;
    }
    const flow = DEMO_ROLE_FLOW[resolved].find((s) => s.href === pathname);
    if (flow) return flow.label;
    if (pathname === DEMO_ROLE_META[resolved].basePath) {
      return `Tổng quan ${DEMO_ROLE_META[resolved].label}`;
    }
  }
  const onboarding = DEMO_ONBOARDING_FLOW.find((s) => s.href === pathname);
  if (onboarding) return onboarding.label;
  if (pathname === "/demo") return "Vinamilk GBP Platform — Demo";
  return "Vinamilk GBP Platform";
}

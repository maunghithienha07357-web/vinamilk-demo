import {
  ASSIGNED_STORE,
  DEMO_STORES,
  GBP_STATE_LABELS,
  KANBAN_STAGE_LABELS,
  type DemoStore,
} from "./demoStores";

export type PanelStoreRow = {
  id: string;
  name: string;
  region: string;
  address: string;
  reason?: string;
  date?: string;
  priority?: "Cao" | "Trung bình" | "Thấp";
  evidenceStatus?: string;
  gbpState?: string;
  rating?: number;
  reviewCount?: number;
  oneStarCount?: number;
  phone?: string;
  kanban?: string;
  lat?: number;
  lng?: number;
};

export function storeToPanelRow(s: DemoStore, extra?: Partial<PanelStoreRow>): PanelStoreRow {
  return {
    id: s.id,
    name: s.name,
    region: s.region,
    address: s.address,
    reason: s.reason,
    gbpState: GBP_STATE_LABELS[s.gbpState],
    evidenceStatus: s.evidenceStatus,
    phone: s.phone,
    kanban: KANBAN_STAGE_LABELS[s.kanbanStage],
    rating: s.rating,
    reviewCount: s.reviewCount,
    oneStarCount: s.oneStarCount,
    lat: s.lat,
    lng: s.lng,
    ...extra,
  };
}

export const SUSPENDED_STORES_DETAIL = DEMO_STORES.filter((s) => s.gbpState === "suspended").map(
  (s) => storeToPanelRow(s, { date: "13/08/2026 08:12" }),
);

export const CLAIM_STORES_DETAIL = DEMO_STORES.filter((s) => s.gbpState === "claim").map((s) =>
  storeToPanelRow(s, { priority: "Cao" }),
);

export const NEW_STORES_DETAIL = DEMO_STORES.filter((s) => s.gbpState === "new").map((s) =>
  storeToPanelRow(s, { date: "12/08/2026" }),
);

export const VERIFY_STORES_DETAIL = DEMO_STORES.filter((s) => s.gbpState === "verify").map((s) =>
  storeToPanelRow(s, { date: s.assignedToStoreManager ? "Hạn nộp 20/08/2026" : "Nộp 11/08/2026" }),
);

export const FUNNEL_STAGE_STORES: Record<string, PanelStoreRow[]> = {
  "Tổng cửa hàng": DEMO_STORES.map((s) => storeToPanelRow(s)),
  Verify: VERIFY_STORES_DETAIL,
  "Đã nộp bằng chứng": DEMO_STORES.filter((s) => s.kanbanStage === "pending_google").map((s) =>
    storeToPanelRow(s),
  ),
  Verified: DEMO_STORES.filter((s) => s.gbpState === "verified").map((s) => storeToPanelRow(s)),
};

export const REVIEW_BREAKDOWN = [
  {
    region: "TP.HCM — Quận 7",
    current: DEMO_STORES.reduce((sum, s) => sum + s.reviewCount, 0),
    target: 200,
    oneStar: DEMO_STORES.reduce((sum, s) => sum + s.oneStarCount, 0),
  },
];

export const REVIEW_TOP_ONE_STAR: PanelStoreRow[] = DEMO_STORES.filter((s) => s.oneStarCount > 0)
  .sort((a, b) => b.oneStarCount - a.oneStarCount)
  .map((s) => storeToPanelRow(s));

export const STORE_LIST_MANAGER: PanelStoreRow[] = DEMO_STORES.map((s) => storeToPanelRow(s));

export const WEEKLY_PROGRESS_BY_PROVINCE = [
  {
    province: "TP.HCM (Quận 7)",
    verified: DEMO_STORES.filter((s) => s.gbpState === "verified").length,
    pending: DEMO_STORES.filter((s) => s.gbpState === "verify" || s.gbpState === "new").length,
    suspended: DEMO_STORES.filter((s) => s.gbpState === "suspended").length,
    reviews: DEMO_STORES.reduce((sum, s) => sum + s.reviewCount, 0),
  },
];

export const WEEKLY_REVIEW_KPI = [
  {
    region: "TP.HCM — Quận 7",
    rating: 3.8,
    reviews: DEMO_STORES.reduce((sum, s) => sum + s.reviewCount, 0),
    replied: 72,
    slaHours: 6,
  },
];

export const STORE_MANAGER_OVERVIEW = {
  id: ASSIGNED_STORE.id,
  name: ASSIGNED_STORE.name,
  address: ASSIGNED_STORE.address,
  phone: ASSIGNED_STORE.phone,
  hours: `${ASSIGNED_STORE.hours} (T2–CN)`,
  website: ASSIGNED_STORE.website,
  gbpState: GBP_STATE_LABELS[ASSIGNED_STORE.gbpState],
  kanban: KANBAN_STAGE_LABELS[ASSIGNED_STORE.kanbanStage],
  rating: ASSIGNED_STORE.rating,
  reviewCount: ASSIGNED_STORE.reviewCount,
  oneStarCount: ASSIGNED_STORE.oneStarCount,
  evidenceSubmitted: 3,
  evidenceRequired: 4,
  deadline: "20/08/2026",
  progress: 65,
  lat: ASSIGNED_STORE.lat,
  lng: ASSIGNED_STORE.lng,
};

export const STORE_EVIDENCE_ITEMS = [
  {
    id: "license",
    label: "Giấy phép kinh doanh",
    status: "submitted" as const,
    file: `evidence/${ASSIGNED_STORE.id}/gpkd.pdf`,
    uploadedAt: "08/08/2026 10:12",
  },
  {
    id: "signage",
    label: "Ảnh bảng hiệu",
    status: "submitted" as const,
    file: `evidence/${ASSIGNED_STORE.id}/bang-hieu.jpg`,
    uploadedAt: "08/08/2026 10:18",
  },
  {
    id: "interior",
    label: "Ảnh nội thất",
    status: "submitted" as const,
    file: `evidence/${ASSIGNED_STORE.id}/noi-that.jpg`,
    uploadedAt: "09/08/2026 14:02",
  },
  {
    id: "video",
    label: "Video mặt tiền",
    status: "missing" as const,
    file: null,
    uploadedAt: null,
  },
];

export type EvidenceUploadKind = "image" | "video" | "file";

export type EvidenceUploadItem = {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  accept: string;
  kind: EvidenceUploadKind;
  status: "submitted" | "missing";
  file: string | null;
  required: boolean;
};

export const STORE_EVIDENCE_GOOGLE_ITEMS: EvidenceUploadItem[] = [
  {
    id: "storefront",
    title: "Ảnh tổng quan mặt tiền điểm bán",
    description:
      "Giúp doanh nghiệp tạo ấn tượng tốt ngay từ ban đầu bằng ảnh mặt tiền chất lượng cao, nhìn rõ cửa hàng từ đường.",
    actionLabel: "Thêm ảnh",
    accept: "image/*",
    kind: "image",
    status: "missing",
    file: null,
    required: true,
  },
  {
    id: "signage",
    title: "Ảnh bảng hiệu cố định gắn tại cửa hàng",
    description: "Ảnh bảng hiệu cố định để khách hàng nhận ra điểm bán ngay lập tức trên Google.",
    actionLabel: "Thêm ảnh",
    accept: "image/*",
    kind: "image",
    status: "submitted",
    file: `evidence/${ASSIGNED_STORE.id}/bang-hieu.jpg`,
    required: true,
  },
  {
    id: "interior",
    title: "Ảnh không gian bên trong cửa hàng",
    description:
      "Giới thiệu không gian cơ sở kinh doanh giúp cửa hàng nổi bật và thu hút khách hàng ở gần.",
    actionLabel: "Thêm ảnh",
    accept: "image/*",
    kind: "image",
    status: "submitted",
    file: `evidence/${ASSIGNED_STORE.id}/noi-that.jpg`,
    required: true,
  },
  {
    id: "video",
    title: "Video xác minh theo yêu cầu của Google",
    description: "Quay video liên tục 15–30 giây: đường phố → bảng hiệu → cửa vào. Bắt buộc để nộp hồ sơ.",
    actionLabel: "Thêm video",
    accept: "video/*",
    kind: "video",
    status: "missing",
    file: null,
    required: true,
  },
  {
    id: "license",
    title: "Giấy phép kinh doanh",
    description: "Bản scan hoặc ảnh rõ nét giấy phép kinh doanh, khớp tên và địa chỉ N.A.P trên hồ sơ.",
    actionLabel: "Thêm file",
    accept: "image/*,.pdf",
    kind: "file",
    status: "submitted",
    file: `evidence/${ASSIGNED_STORE.id}/gpkd.pdf`,
    required: true,
  },
];

export const STORE_EVIDENCE_INTERNAL_ITEMS: EvidenceUploadItem[] = [
  {
    id: "legal",
    title: "Tài liệu pháp lý của doanh nghiệp",
    description: "Giấy tờ pháp lý bổ sung nếu Google hoặc Manager yêu cầu đối chiếu.",
    actionLabel: "Thêm file",
    accept: "image/*,.pdf",
    kind: "file",
    status: "missing",
    file: null,
    required: false,
  },
  {
    id: "branding",
    title: "Biển hiệu, nhận diện tại điểm bán",
    description: "Ảnh nhận diện thương hiệu tại điểm bán — banner, decal, standee nếu có.",
    actionLabel: "Thêm ảnh",
    accept: "image/*",
    kind: "image",
    status: "missing",
    file: null,
    required: false,
  },
  {
    id: "menu",
    title: "Ấn phẩm thương hiệu, thực đơn (nếu có)",
    description: "Menu, brochure hoặc ấn phẩm in ấn tại cửa hàng để hỗ trợ đối chiếu nhận diện.",
    actionLabel: "Thêm ảnh",
    accept: "image/*,.pdf",
    kind: "file",
    status: "missing",
    file: null,
    required: false,
  },
  {
    id: "invoice",
    title: "Hóa đơn, chứng từ hỗ trợ (nếu phù hợp)",
    description: "Hóa đơn hoặc chứng từ liên quan điểm bán khi cần bổ sung hồ sơ.",
    actionLabel: "Thêm file",
    accept: "image/*,.pdf",
    kind: "file",
    status: "missing",
    file: null,
    required: false,
  },
  {
    id: "poa",
    title: "Văn bản ủy quyền xử lý (nếu cần)",
    description: "Giấy ủy quyền nếu người nộp hồ sơ không phải chủ giấy phép.",
    actionLabel: "Thêm file",
    accept: "image/*,.pdf",
    kind: "file",
    status: "missing",
    file: null,
    required: false,
  },
];

export const STORE_EVIDENCE_PROCESS_STEPS = {
  currentIndex: 1,
  steps: [
    "Chưa sẵn sàng",
    "Thu thập minh chứng",
    "Kiểm định minh chứng",
    "Minh chứng đạt",
    "Sẵn sàng xử lý",
  ],
};

export const STORE_PENDING_TASKS = [
  {
    id: "t1",
    title: "Quay video mặt tiền (bắt buộc)",
    due: "20/08/2026",
    href: "/demo/store-manager/evidence",
    urgent: true,
  },
  {
    id: "t2",
    title: "Kiểm tra N.A.P khớp giấy phép",
    due: "18/08/2026",
    href: "/demo/store-manager/nap",
    urgent: false,
  },
  {
    id: "t3",
    title: `Xem ${ASSIGNED_STORE.oneStarCount} đánh giá 1★ chưa phản hồi`,
    due: "Hôm nay",
    href: "/demo/store-manager/reviews",
    urgent: true,
  },
];

export const STORE_NAP = {
  name: ASSIGNED_STORE.name,
  address: ASSIGNED_STORE.address,
  phone: ASSIGNED_STORE.phone,
  hours: `${ASSIGNED_STORE.hours} (Thứ 2 – Chủ nhật)`,
  category: ASSIGNED_STORE.category,
  website: ASSIGNED_STORE.website,
  placeId: ASSIGNED_STORE.googlePlaceId,
  lastSynced: "12/08/2026 09:40 — chưa đẩy lên Google (chờ Verify)",
  lat: ASSIGNED_STORE.lat,
  lng: ASSIGNED_STORE.lng,
};

export const STORE_GBP_TIMELINE = [
  {
    id: "claim",
    label: "Claim listing",
    date: "01/08/2026",
    status: "done" as const,
    note: "Manager đã claim GBP cho cửa hàng.",
  },
  {
    id: "evidence",
    label: "Nộp bằng chứng",
    date: "Đang mở — hạn 20/08/2026",
    status: "current" as const,
    note: "Thiếu video mặt tiền. 3/4 checklist đã hoàn thành.",
  },
  {
    id: "review",
    label: "Google xét duyệt",
    date: "Chưa bắt đầu",
    status: "pending" as const,
    note: "Manager nộp hồ sơ lên Google sau khi checklist đủ.",
  },
  {
    id: "verified",
    label: "Verified",
    date: "Chưa bắt đầu",
    status: "pending" as const,
    note: "Sau khi Google duyệt, listing hiển thị công khai.",
  },
];

export const STORE_GUIDE_STEPS = [
  {
    step: 1,
    title: "Chuẩn bị giấy tờ",
    body: "Giấy phép kinh doanh đúng tên cửa hàng, ảnh bảng hiệu rõ chữ Vinamilk, ảnh nội thất ban ngày.",
  },
  {
    step: 2,
    title: "Quay video mặt tiền",
    body: "Quay liên tục 15–30 giây, bắt đầu từ đường phố, pan chậm tới bảng hiệu rồi vào cửa. Không cắt ghép, không nhạc nền.",
  },
  {
    step: 3,
    title: "Tải lên module Bằng chứng",
    body: "Kéo thả file vào checklist. Hệ thống lưu video/ảnh lên Cloudflare R2; metadata ghi bảng evidence (bản demo không ghi file).",
  },
  {
    step: 4,
    title: "Chờ Manager duyệt",
    body: "Agency PM kiểm tra checklist rồi nộp Claim / Verify lên Google. Bạn theo dõi trạng thái tại module Trạng thái hồ sơ.",
  },
];

export const STORE_GUIDE_FAQ = [
  {
    q: "Video cần quay như thế nào?",
    a: "Quay ngang, đủ sáng, thấy rõ bảng hiệu và cửa ra vào. Thời lượng 15–30 giây, không zoom giật, không overlay text.",
  },
  {
    q: "Tôi có được sửa N.A.P không?",
    a: "Store Manager chỉ xem N.A.P. Muốn sửa Name / Address / Phone phải gửi yêu cầu — Manager hoặc Admin mới Mass Update và sync Google.",
  },
  {
    q: "Khi nào Google gọi xác minh?",
    a: "Sau khi Manager nộp hồ sơ. Hãy đảm bảo SĐT cửa hàng nghe máy trong giờ mở cửa.",
  },
  {
    q: "Tôi có trả lời đánh giá được không?",
    a: "Không. Store Manager chỉ đọc đánh giá. Agency PM trả lời hộ theo SLA để đồng bộ giọng điệu thương hiệu.",
  },
];

export type GbpState = "claim" | "suspended" | "new" | "verify" | "verified";
export type KanbanStage =
  | "need_evidence"
  | "evidence_uploaded"
  | "pending_google"
  | "done";
export type SyncStatus = "idle" | "queued" | "processing" | "success" | "failed";

export type DemoStore = {
  id: string;
  name: string;
  address: string;
  phone: string;
  category: string;
  hours: string;
  website: string;
  region: string;
  gbpState: GbpState;
  kanbanStage: KanbanStage;
  syncStatus: SyncStatus;
  googlePlaceId: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  oneStarCount: number;
  evidenceStatus: string;
  reason?: string;
  assignedToStoreManager?: boolean;
};

/** 5 cửa hàng Giấc Mơ Sữa Việt / Vinamilk Experience — cụm Quận 7, có tọa độ map. */
export const DEMO_STORES: DemoStore[] = [
  {
    id: "store-gmsv-bbd",
    name: "Vinamilk Trải nghiệm — 11 Bùi Bằng Đoàn",
    address: "11 Bùi Bằng Đoàn, Tân Hưng, Quận 7, TP.HCM",
    phone: "028 5413 1111",
    category: "Cửa hàng trải nghiệm",
    hours: "8:00 - 21:00",
    website: "https://www.vinamilk.com.vn",
    region: "TP.HCM",
    gbpState: "verify",
    kanbanStage: "need_evidence",
    syncStatus: "queued",
    googlePlaceId: "ChIJ-bbd-q7-vinamilk",
    lat: 10.7294,
    lng: 106.7219,
    rating: 3.4,
    reviewCount: 38,
    oneStarCount: 9,
    evidenceStatus: "Thiếu video mặt tiền",
    reason: "Hồ sơ Verify — Store Manager đang thu thập bằng chứng",
    assignedToStoreManager: true,
  },
  {
    id: "store-gmsv-tantrao",
    name: "Giấc Mơ Sữa Việt Tân Trào — CH40171",
    address: "10 Tân Trào, Tân Phú, Quận 7, TP.HCM",
    phone: "028 5416 1010",
    category: "Cửa hàng sữa",
    hours: "8:00 - 19:30",
    website: "https://giacmosuaviet.com.vn",
    region: "TP.HCM",
    gbpState: "suspended",
    kanbanStage: "need_evidence",
    syncStatus: "failed",
    googlePlaceId: "ChIJ-tantrao-vinamilk",
    lat: 10.73205,
    lng: 106.72148,
    rating: 3.6,
    reviewCount: 52,
    oneStarCount: 7,
    evidenceStatus: "Cần quay lại video bảng hiệu",
    reason: "Suspended: N.A.P không khớp giấy phép / video không thấy bảng hiệu",
  },
  {
    id: "store-gmsv-txs",
    name: "Giấc Mơ Sữa Việt Trần Xuân Soạn",
    address: "396 Đ. Trần Xuân Soạn, Tân Kiểng, Quận 7, TP.HCM",
    phone: "028 3775 3960",
    category: "Cửa hàng sữa",
    hours: "7:30 - 18:00",
    website: "https://giacmosuaviet.com.vn",
    region: "TP.HCM",
    gbpState: "claim",
    kanbanStage: "need_evidence",
    syncStatus: "idle",
    googlePlaceId: "ChIJ-txs-vinamilk",
    lat: 10.7471,
    lng: 106.7059,
    rating: 0,
    reviewCount: 0,
    oneStarCount: 0,
    evidenceStatus: "Chưa nộp",
    reason: "Chưa có listing GBP — ưu tiên vì nằm cụm Q7",
  },
  {
    id: "store-gmsv-lvb",
    name: "Giấc Mơ Sữa Việt Lâm Văn Bền",
    address: "123 Lâm Văn Bền, Tân Kiểng, Quận 7, TP.HCM",
    phone: "028 3775 0123",
    category: "Siêu thị mini",
    hours: "7:00 - 21:00",
    website: "https://giacmosuaviet.com.vn",
    region: "TP.HCM",
    gbpState: "new",
    kanbanStage: "need_evidence",
    syncStatus: "idle",
    googlePlaceId: "ChIJ-lvb-vinamilk",
    lat: 10.7415,
    lng: 106.7148,
    rating: 0,
    reviewCount: 0,
    oneStarCount: 0,
    evidenceStatus: "Đã import, chờ tag",
    reason: "Vừa import — chờ gán Store Manager và tag GBP",
  },
  {
    id: "store-gmsv-tdt",
    name: "Giấc Mơ Sữa Việt Tôn Dật Tiên",
    address: "101 Tôn Dật Tiên, Tân Phú, Quận 7, TP.HCM",
    phone: "028 5413 0101",
    category: "Cửa hàng sữa",
    hours: "8:00 - 21:00",
    website: "https://giacmosuaviet.com.vn",
    region: "TP.HCM",
    gbpState: "verify",
    kanbanStage: "pending_google",
    syncStatus: "success",
    googlePlaceId: "ChIJ-tdt-vinamilk",
    lat: 10.7286,
    lng: 106.7188,
    rating: 4.3,
    reviewCount: 19,
    oneStarCount: 1,
    evidenceStatus: "Đã nộp đủ — chờ Google",
    reason: "Verify: đã nộp bằng chứng, chờ Google duyệt",
  },
];

export const ASSIGNED_STORE =
  DEMO_STORES.find((s) => s.assignedToStoreManager) ?? DEMO_STORES[0];

export const DEMO_STORE_COUNTS = {
  total: DEMO_STORES.length,
  claim: DEMO_STORES.filter((s) => s.gbpState === "claim").length,
  suspended: DEMO_STORES.filter((s) => s.gbpState === "suspended").length,
  new: DEMO_STORES.filter((s) => s.gbpState === "new").length,
  verify: DEMO_STORES.filter((s) => s.gbpState === "verify").length,
  verified: DEMO_STORES.filter((s) => s.gbpState === "verified").length,
};

export const DEMO_REVIEW_KPI = {
  current: DEMO_STORES.reduce((sum, s) => sum + s.reviewCount, 0),
  target: 200,
};

export const MAP_CLUSTER = {
  lat: 10.7357,
  lng: 106.7166,
  zoom: 14,
};

export function getStoresByGbpState(state: GbpState): DemoStore[] {
  return DEMO_STORES.filter((s) => s.gbpState === state);
}

export function getStoresByKanbanStage(stage: KanbanStage): DemoStore[] {
  return DEMO_STORES.filter((s) => s.kanbanStage === stage);
}

export function getSuspendedStoresRecent(): DemoStore[] {
  return DEMO_STORES.filter((s) => s.gbpState === "suspended");
}

export function googleMapsEmbedUrl(lat: number, lng: number, zoom = 16): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&hl=vi&z=${zoom}&output=embed`;
}

export const GBP_STATE_LABELS: Record<GbpState, string> = {
  claim: "Claim",
  suspended: "Suspended",
  new: "New",
  verify: "Verify",
  verified: "Verified",
};

export const KANBAN_STAGE_LABELS: Record<KanbanStage, string> = {
  need_evidence: "Cần thu thập bằng chứng",
  evidence_uploaded: "Đã tải video",
  pending_google: "Chờ Google duyệt",
  done: "Thành công",
};

export const SYNC_STATUS_LABELS: Record<SyncStatus, string> = {
  idle: "Chưa đồng bộ",
  queued: "Đang chờ",
  processing: "Đang xử lý",
  success: "Thành công",
  failed: "Lỗi",
};

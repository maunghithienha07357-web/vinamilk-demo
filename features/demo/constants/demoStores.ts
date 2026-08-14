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
};

const REGIONS = ["Miền Bắc", "Miền Trung", "Miền Nam", "Hà Nội", "TP.HCM"];
const CATEGORIES = [
  "Cửa hàng sữa",
  "Siêu thị mini",
  "Đại lý phân phối",
  "Cửa hàng tiện lợi",
];

const GBP_DISTRIBUTION: { state: GbpState; count: number }[] = [
  { state: "claim", count: 80 },
  { state: "suspended", count: 121 },
  { state: "new", count: 126 },
  { state: "verify", count: 233 },
];

const KANBAN_STAGES: KanbanStage[] = [
  "need_evidence",
  "evidence_uploaded",
  "pending_google",
  "done",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildGbpStates(): GbpState[] {
  const states: GbpState[] = [];
  for (const { state, count } of GBP_DISTRIBUTION) {
    for (let i = 0; i < count; i++) states.push(state);
  }
  return states;
}

const GBP_STATES = buildGbpStates();

export function generateDemoStores(): DemoStore[] {
  const rand = seededRandom(42);
  const stores: DemoStore[] = [];

  for (let i = 0; i < 560; i++) {
    const num = i + 1;
    const region = REGIONS[Math.floor(rand() * REGIONS.length)];
    const gbpState = GBP_STATES[i];
    const kanbanStage = KANBAN_STAGES[Math.floor(rand() * KANBAN_STAGES.length)];
    const syncStatuses: SyncStatus[] = ["idle", "success", "success", "success", "failed", "queued"];
    const syncStatus = syncStatuses[Math.floor(rand() * syncStatuses.length)];

    stores.push({
      id: `store-${String(num).padStart(4, "0")}`,
      name: `Vinamilk ${region} — CH ${num}`,
      address: `${100 + (num % 200)} Đường ${num % 50 + 1}, Quận ${(num % 12) + 1}, ${region}`,
      phone: `028${String(10000000 + num).slice(0, 8)}`,
      category: CATEGORIES[num % CATEGORIES.length],
      hours: "7:00 - 21:00",
      website: num % 3 === 0 ? `https://vinamilk.com.vn/ch-${num}` : "",
      region,
      gbpState,
      kanbanStage,
      syncStatus,
      googlePlaceId: `ChIJ${String(num).padStart(8, "0")}`,
    });
  }

  return stores;
}

export const DEMO_STORES = generateDemoStores();

export const DEMO_STORE_COUNTS = {
  total: 560,
  claim: 80,
  suspended: 121,
  new: 126,
  verify: 233,
  verified: 0,
};

export const DEMO_REVIEW_KPI = {
  current: 2180,
  target: 6500,
};

export function getStoresByGbpState(state: GbpState): DemoStore[] {
  return DEMO_STORES.filter((s) => s.gbpState === state);
}

export function getStoresByKanbanStage(stage: KanbanStage): DemoStore[] {
  return DEMO_STORES.filter((s) => s.kanbanStage === stage);
}

export function getSuspendedStoresRecent(): DemoStore[] {
  return DEMO_STORES.filter((s) => s.gbpState === "suspended").slice(0, 12);
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

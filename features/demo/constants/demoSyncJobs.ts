import { DEMO_STORES, type SyncStatus } from "./demoStores";

export type DemoSyncJob = {
  id: string;
  storeName: string;
  jobType: "status_sync" | "nap_update" | "review_fetch" | "review_reply" | "claim" | "appeal" | "verify";
  status: SyncStatus;
  errorMessage?: string;
  createdAt: string;
  processedAt?: string;
};

const TYPES: DemoSyncJob["jobType"][] = [
  "verify",
  "appeal",
  "claim",
  "nap_update",
  "review_fetch",
];

export const DEMO_SYNC_JOBS: DemoSyncJob[] = DEMO_STORES.map((store, i) => ({
  id: `job-${String(i + 1).padStart(3, "0")}`,
  storeName: store.name,
  jobType: TYPES[i % TYPES.length],
  status: store.syncStatus,
  errorMessage: store.syncStatus === "failed" ? "Google API: video bảng hiệu không đạt" : undefined,
  createdAt: `2026-08-12T0${8 - i}:15:00Z`,
  processedAt: store.syncStatus === "success" ? `2026-08-12T0${8 - i}:15:32Z` : undefined,
}));

export const JOB_TYPE_LABELS: Record<DemoSyncJob["jobType"], string> = {
  status_sync: "Đồng bộ trạng thái",
  nap_update: "Cập nhật N.A.P",
  review_fetch: "Kéo đánh giá",
  review_reply: "Trả lời đánh giá",
  claim: "Claim listing",
  appeal: "Appeal Suspended",
  verify: "Verify hồ sơ",
};

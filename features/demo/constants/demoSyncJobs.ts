import type { SyncStatus } from "./demoStores";

export type DemoSyncJob = {
  id: string;
  storeName: string;
  jobType: "status_sync" | "nap_update" | "review_fetch" | "review_reply" | "claim" | "appeal" | "verify";
  status: SyncStatus;
  errorMessage?: string;
  createdAt: string;
  processedAt?: string;
};

export const DEMO_SYNC_JOBS: DemoSyncJob[] = [
  {
    id: "job-001",
    storeName: "Vinamilk TP.HCM — CH 42",
    jobType: "nap_update",
    status: "success",
    createdAt: "2026-08-12T08:15:00Z",
    processedAt: "2026-08-12T08:15:32Z",
  },
  {
    id: "job-002",
    storeName: "Vinamilk Hà Nội — CH 128",
    jobType: "appeal",
    status: "processing",
    createdAt: "2026-08-12T08:20:00Z",
  },
  {
    id: "job-003",
    storeName: "Vinamilk Miền Trung — CH 256",
    jobType: "verify",
    status: "queued",
    createdAt: "2026-08-12T08:22:00Z",
  },
  {
    id: "job-004",
    storeName: "Vinamilk Miền Nam — CH 89",
    jobType: "review_fetch",
    status: "success",
    createdAt: "2026-08-12T07:45:00Z",
    processedAt: "2026-08-12T07:46:10Z",
  },
  {
    id: "job-005",
    storeName: "Vinamilk TP.HCM — CH 301",
    jobType: "claim",
    status: "failed",
    errorMessage: "Google API quota exceeded — retry sau 5 phút",
    createdAt: "2026-08-12T07:30:00Z",
    processedAt: "2026-08-12T07:30:45Z",
  },
  {
    id: "job-006",
    storeName: "Vinamilk Hà Nội — CH 15",
    jobType: "nap_update",
    status: "success",
    createdAt: "2026-08-12T07:00:00Z",
    processedAt: "2026-08-12T07:00:28Z",
  },
  {
    id: "job-007",
    storeName: "Vinamilk Miền Bắc — CH 445",
    jobType: "review_reply",
    status: "success",
    createdAt: "2026-08-12T06:55:00Z",
    processedAt: "2026-08-12T06:55:12Z",
  },
  {
    id: "job-008",
    storeName: "Vinamilk TP.HCM — CH 512",
    jobType: "status_sync",
    status: "success",
    createdAt: "2026-08-12T06:30:00Z",
    processedAt: "2026-08-12T06:30:55Z",
  },
];

export const JOB_TYPE_LABELS: Record<DemoSyncJob["jobType"], string> = {
  status_sync: "Đồng bộ trạng thái",
  nap_update: "Cập nhật N.A.P",
  review_fetch: "Lấy đánh giá",
  review_reply: "Trả lời đánh giá",
  claim: "Claim Ownership",
  appeal: "Suspended Appeal",
  verify: "Verify",
};

export const DEMO_COST_COMPARISON = [
  {
    criterion: "Định vị",
    aws: "Giải pháp Cloud truyền thống, phù hợp ngân sách IT cực lớn",
    vercel: "Kiến trúc Modern Serverless, linh hoạt, tốc độ cao",
  },
  {
    criterion: "Hosting",
    aws: "Amazon EC2/ECS — cấu hình thủ công, bảo trì định kỳ",
    vercel: "Vercel — Auto-scaling, tốc độ tải trang cực nhanh",
  },
  {
    criterion: "Database",
    aws: "Amazon RDS PostgreSQL — cấu hình phức tạp, chi phí cao",
    vercel: "Supabase PostgreSQL — 100GB, RLS tích hợp sẵn",
  },
  {
    criterion: "Kho bằng chứng (Video/Ảnh)",
    aws: "Amazon S3 — chuẩn mực, Egress Fee cao mỗi lần xem video",
    vercel: "Cloudflare R2 — tương thích S3, Egress Fee = $0",
  },
  {
    criterion: "Chi phí hàng tháng",
    aws: "~$150–500/tháng (3.8–12.5 triệu VNĐ)",
    vercel: "~$85–125/tháng (2.2–3.3 triệu VNĐ)",
  },
  {
    criterion: "Time-to-market",
    aws: "4–6 tuần",
    vercel: "2–3 tuần (MVP Capability Test)",
  },
] as const;

export const DEMO_STORAGE_FLOW = [
  {
    step: 1,
    title: "Client xin presigned URL",
    description: "Server Action tạo signed upload URL từ R2, trả về client",
  },
  {
    step: 2,
    title: "Upload trực tiếp lên R2",
    description: "Browser upload video/ảnh thẳng lên Cloudflare R2 — không qua server",
  },
  {
    step: 3,
    title: "Lưu file_path vào Postgres",
    description: "Chỉ metadata (path, type, store_id) vào bảng evidence trên Supabase",
  },
  {
    step: 4,
    title: "Phát qua signed URL / CDN",
    description: "Admin xem video in-app qua signed URL — Egress Fee = $0",
  },
] as const;

export const DEMO_R2_STATS = {
  plan: "Cloudflare R2",
  storage: "5 TB @ $0.015/GB/tháng",
  egress: "$0 — miễn phí 100% băng thông ra",
  cdn: "Cloudflare CDN toàn cầu",
};

export const DEMO_VERCEL_STATS = {
  plan: "Vercel Pro",
  cost: "~$25/tháng",
  features: "Preview deploy, Edge Functions, Cron Jobs",
};

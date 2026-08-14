import type { DemoRole } from "../../constants/demoRoles";
import { ReviewInbox } from "../reviews/ReviewInbox";

export function ReviewsPage({ role }: { role: DemoRole }) {
  const isStore = role === "store_manager";

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        {isStore
          ? "Đánh giá cửa hàng của bạn — chỉ đọc. Store Manager không Quick Reply; Admin/Manager trả lời trên hộp thư tổng."
          : "Module 4 — Reputation Inbox: gom review 560 cửa hàng, Quick Reply với template. Đồng bộ từ Google Reviews API → bảng reviews trên Supabase."}
      </p>

      <ReviewInbox readOnly={isStore} />
    </div>
  );
}

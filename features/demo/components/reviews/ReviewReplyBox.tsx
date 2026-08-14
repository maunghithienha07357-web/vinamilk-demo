"use client";

import { useState } from "react";
import type { DemoReview } from "../../constants/demoReviews";
import { DEMO_REPLY_TEMPLATES } from "../../constants/demoReviews";

export function ReviewReplyBox({ review }: { review: DemoReview }) {
  const [reply, setReply] = useState(review.replyText ?? "");

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">Quick Reply</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {DEMO_REPLY_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setReply(t.body)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            {t.label}
          </button>
        ))}
      </div>
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Nhập phản hồi hoặc chọn template..."
        className="mt-3 w-full rounded-lg border border-slate-200 p-3 text-sm"
        rows={4}
      />
      <p className="mt-2 text-xs text-slate-500">
        Bản demo — gửi phản hồi sẽ gọi Google Reply API qua Server Action ở bản production.
      </p>
    </div>
  );
}

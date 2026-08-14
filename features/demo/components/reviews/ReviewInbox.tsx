"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";
import type { DemoReview } from "../../constants/demoReviews";
import { DEMO_REVIEWS } from "../../constants/demoReviews";
import { DemoBadge } from "../ui/DemoBadge";
import { ReviewReplyBox } from "./ReviewReplyBox";

type Filter = "all" | "low" | "unreplied" | "region";
type SortKey = "newest" | "oldest" | "rating-asc" | "rating-desc";

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "newest", label: "Mới nhất" },
  { id: "oldest", label: "Cũ nhất" },
  { id: "rating-asc", label: "Sao thấp → cao" },
  { id: "rating-desc", label: "Sao cao → thấp" },
];

const FILTER_OPTIONS: { id: Filter; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "low", label: "1–2 sao" },
  { id: "unreplied", label: "Chưa phản hồi" },
  { id: "region", label: "Theo vùng" },
];

function matchesSearch(review: DemoReview, query: string): boolean {
  if (!query) return true;
  const haystack = [
    review.reviewerName,
    review.storeName,
    review.comment,
    review.region,
    review.replyText ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function ReviewInbox({ readOnly = false }: { readOnly?: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<DemoReview | null>(DEMO_REVIEWS[0] ?? null);
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = DEMO_REVIEWS.filter((r) => matchesSearch(r, q));
    if (filter === "low") result = result.filter((r) => r.rating <= 2);
    if (filter === "unreplied") result = result.filter((r) => !r.replied);
    if (filter === "region" && regionFilter) {
      result = result.filter((r) => r.region === regionFilter);
    }
    const sorted = [...result];
    sorted.sort((a, b) => {
      if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
      if (sort === "rating-asc") return a.rating - b.rating;
      if (sort === "rating-desc") return b.rating - a.rating;
      return b.createdAt.localeCompare(a.createdAt);
    });
    return sorted;
  }, [filter, query, regionFilter, sort]);

  const sortLabel = SORT_OPTIONS.find((o) => o.id === sort)?.label ?? "Sắp xếp";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm tên người, cửa hàng, nội dung, vùng…"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#1a5c3a]"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setShowFilters((v) => !v);
              setShowSort(false);
            }}
            title="Bộ lọc"
            className={`relative shrink-0 rounded-lg border p-2.5 ${
              showFilters || filter !== "all"
                ? "border-[#1a5c3a] bg-[#1a5c3a]/10 text-[#1a5c3a]"
                : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {filter !== "all" && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#1a5c3a]" />
            )}
          </button>
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowSort((v) => !v);
                setShowFilters(false);
              }}
              title={`Sắp xếp: ${sortLabel}`}
              className={`rounded-lg border p-2.5 ${
                showSort || sort !== "newest"
                  ? "border-[#1a5c3a] bg-[#1a5c3a]/10 text-[#1a5c3a]"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>
            {showSort && (
              <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSort(opt.id);
                      setShowSort(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-sm ${
                      sort === opt.id
                        ? "bg-[#1a5c3a]/10 font-medium text-[#1a5c3a]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {showFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFilter(opt.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  filter === opt.id ? "bg-[#1a5c3a] text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
            {filter === "region" && (
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
              >
                <option value="">Chọn vùng</option>
                <option value="Miền Bắc">Miền Bắc</option>
                <option value="Miền Trung">Miền Trung</option>
                <option value="Miền Nam">Miền Nam</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP.HCM">TP.HCM</option>
              </select>
            )}
          </div>
        )}
        <p className="text-[11px] text-slate-400">{filtered.length} đánh giá</p>
      </div>

      <div className="flex h-[560px]">
        <div className="flex w-96 shrink-0 flex-col border-r border-slate-200">
          <ul className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-slate-400">
                Không tìm thấy đánh giá
              </li>
            ) : (
              filtered.map((review) => (
                <li key={review.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(review)}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 ${
                      selected?.id === review.id ? "bg-sidebar-accent/50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-800">
                        {review.reviewerName}
                      </span>
                      <span className="text-amber-500">{"★".repeat(review.rating)}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-500">{review.storeName}</p>
                    {!review.replied && (
                      <DemoBadge variant="warning" className="mt-2">
                        Chưa phản hồi
                      </DemoBadge>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto p-5">
          {selected ? (
            <>
              <div className="mb-4">
                <h3 className="font-semibold text-slate-900">{selected.reviewerName}</h3>
                <p className="text-sm text-slate-500">
                  {selected.storeName} · {selected.region}
                </p>
                <p className="mt-2 text-slate-700">{selected.comment}</p>
              </div>
              {readOnly ? (
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Store Manager chỉ đọc đánh giá. Quick Reply dành cho Admin / Manager.
                </p>
              ) : (
                <ReviewReplyBox review={selected} />
              )}
            </>
          ) : (
            <p className="text-slate-500">Chọn một đánh giá để xem chi tiết</p>
          )}
        </div>
      </div>
    </div>
  );
}

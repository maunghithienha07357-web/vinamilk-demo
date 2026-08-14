"use client";

import { useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  WEEKLY_PROGRESS_BY_PROVINCE,
  WEEKLY_REVIEW_KPI,
} from "../../constants/demoPanelData";
import { DemoCard } from "../ui/DemoCard";
import { DemoCallout } from "../ui/DemoCallout";
import { DemoDetailPanel } from "../ui/DemoDetailPanel";
import { DemoActionButton } from "../ui/DemoActionButton";
import { DemoExportMenu } from "../ui/DemoExportMenu";

const PROGRESS_COLUMNS = [
  { key: "province", header: "Tỉnh / thành" },
  { key: "verified", header: "Verified" },
  { key: "pending", header: "Đang xử lý" },
  { key: "suspended", header: "Suspended" },
  { key: "reviews", header: "Đánh giá" },
];

const KPI_COLUMNS = [
  { key: "region", header: "Khu vực" },
  { key: "rating", header: "Rating TB" },
  { key: "reviews", header: "Số đánh giá" },
  { key: "replied", header: "Đã trả lời" },
  { key: "slaHours", header: "SLA (giờ)" },
];

export function ManagerReportPage() {
  const [province, setProvince] = useState<(typeof WEEKLY_PROGRESS_BY_PROVINCE)[number] | null>(
    null,
  );
  const chartRef = useRef<HTMLDivElement>(null);
  const kpiRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Báo cáo tiến độ tuần — Agency PM gửi Vinamilk: Verified / đang xử lý / Suspended theo tỉnh
        thành, kèm KPI đánh giá. Nhấn cột biểu đồ để xem chi tiết tỉnh.
      </p>

      <DemoCallout variant="info">
        Số liệu mock tuần 11–17/08/2026. Production lấy từ RPC aggregate trên Supabase, không
        select(*) 560 cửa hàng.
      </DemoCallout>

      <DemoCard
        title="Tiến độ GBP theo tỉnh / thành"
        contentRef={chartRef}
        action={
          <DemoExportMenu
            title="Tiến độ GBP tuần 11–17/08/2026"
            columns={PROGRESS_COLUMNS}
            rows={WEEKLY_PROGRESS_BY_PROVINCE.map((r) => ({
              province: r.province,
              verified: String(r.verified),
              pending: String(r.pending),
              suspended: String(r.suspended),
              reviews: String(r.reviews),
            }))}
            captureRef={chartRef}
            fileBase="vinamilk-gbp-weekly-progress"
          />
        }
      >
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={WEEKLY_PROGRESS_BY_PROVINCE}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="province" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="verified"
                name="Verified"
                stackId="a"
                fill="#1a5c3a"
                cursor="pointer"
                onClick={(data) => {
                  const payload = data as { payload?: (typeof WEEKLY_PROGRESS_BY_PROVINCE)[number] };
                  if (payload.payload) setProvince(payload.payload);
                }}
              />
              <Bar
                dataKey="pending"
                name="Đang xử lý"
                stackId="a"
                fill="#f59e0b"
                cursor="pointer"
                onClick={(data) => {
                  const payload = data as { payload?: (typeof WEEKLY_PROGRESS_BY_PROVINCE)[number] };
                  if (payload.payload) setProvince(payload.payload);
                }}
              />
              <Bar
                dataKey="suspended"
                name="Suspended"
                stackId="a"
                fill="#dc2626"
                cursor="pointer"
                onClick={(data) => {
                  const payload = data as { payload?: (typeof WEEKLY_PROGRESS_BY_PROVINCE)[number] };
                  if (payload.payload) setProvince(payload.payload);
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Nhấn vào cột tỉnh / thành để mở panel chi tiết
        </p>
      </DemoCard>

      <DemoCard
        title="KPI đánh giá theo khu vực"
        contentRef={kpiRef}
        action={
          <DemoExportMenu
            title="KPI đánh giá tuần 11–17/08/2026"
            columns={KPI_COLUMNS}
            rows={WEEKLY_REVIEW_KPI.map((r) => ({
              region: r.region,
              rating: String(r.rating),
              reviews: String(r.reviews),
              replied: String(r.replied),
              slaHours: String(r.slaHours),
            }))}
            captureRef={kpiRef}
            fileBase="vinamilk-gbp-weekly-kpi"
          />
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-4 font-medium">Khu vực</th>
                <th className="py-2 pr-4 font-medium">Rating TB</th>
                <th className="py-2 pr-4 font-medium">Số đánh giá</th>
                <th className="py-2 pr-4 font-medium">Đã trả lời</th>
                <th className="py-2 font-medium">SLA (giờ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {WEEKLY_REVIEW_KPI.map((row) => (
                <tr key={row.region}>
                  <td className="py-2.5 pr-4 font-medium text-slate-800">{row.region}</td>
                  <td className="py-2.5 pr-4">★ {row.rating}</td>
                  <td className="py-2.5 pr-4">{row.reviews.toLocaleString("vi-VN")}</td>
                  <td className="py-2.5 pr-4">
                    {row.replied.toLocaleString("vi-VN")} (
                    {Math.round((row.replied / row.reviews) * 100)}%)
                  </td>
                  <td className="py-2.5">{row.slaHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DemoCard>

      <DemoDetailPanel
        open={province !== null}
        onClose={() => setProvince(null)}
        title={province ? `Tiến độ — ${province.province}` : ""}
        subtitle="Tuần 11–17/08/2026"
        bodyRef={panelRef}
        headerAction={
          <DemoExportMenu
            title={province ? `Tiến độ — ${province.province}` : "Tiến độ tỉnh"}
            columns={PROGRESS_COLUMNS}
            rows={
              province
                ? [
                    {
                      province: province.province,
                      verified: String(province.verified),
                      pending: String(province.pending),
                      suspended: String(province.suspended),
                      reviews: String(province.reviews),
                    },
                  ]
                : []
            }
            captureRef={panelRef}
            fileBase={province ? `vinamilk-gbp-${province.province}` : "vinamilk-gbp-province"}
          />
        }
      >
        {province && (
          <div className="space-y-4 text-sm">
            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-emerald-50 p-3">
                <dt className="text-xs text-emerald-700">Verified</dt>
                <dd className="mt-1 text-2xl font-bold text-emerald-800">{province.verified}</dd>
              </div>
              <div className="rounded-lg bg-amber-50 p-3">
                <dt className="text-xs text-amber-700">Đang xử lý</dt>
                <dd className="mt-1 text-2xl font-bold text-amber-800">{province.pending}</dd>
              </div>
              <div className="rounded-lg bg-red-50 p-3">
                <dt className="text-xs text-red-700">Suspended</dt>
                <dd className="mt-1 text-2xl font-bold text-red-800">{province.suspended}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs text-slate-500">Đánh giá tuần</dt>
                <dd className="mt-1 text-2xl font-bold text-slate-800">{province.reviews}</dd>
              </div>
            </dl>
            <p className="text-slate-600">
              Ưu tiên: xử lý {province.suspended} cửa hàng Suspended tại {province.province} trước,
              sau đó đẩy {province.pending} hồ sơ đang Verify.
            </p>
            <DemoActionButton href="/demo/manager/stores" variant="primary" className="w-full">
              Lọc danh sách cửa hàng
            </DemoActionButton>
          </div>
        )}
      </DemoDetailPanel>
    </div>
  );
}

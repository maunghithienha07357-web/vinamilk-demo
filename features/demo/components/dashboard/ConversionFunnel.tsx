"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DEMO_STORE_COUNTS } from "../../constants/demoStores";
import { FUNNEL_STAGE_STORES } from "../../constants/demoPanelData";

const FUNNEL_DATA = [
  { stage: "Tổng cửa hàng", count: DEMO_STORE_COUNTS.total },
  { stage: "Verify", count: DEMO_STORE_COUNTS.verify },
  { stage: "Đã nộp bằng chứng", count: FUNNEL_STAGE_STORES["Đã nộp bằng chứng"].length },
  { stage: "Verified", count: DEMO_STORE_COUNTS.verified },
];

export function ConversionFunnel({
  onBarClick,
}: {
  onBarClick?: (stage: string) => void;
}) {
  return (
    <div className="w-full">
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={FUNNEL_DATA} layout="vertical" margin={{ left: 80, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="stage" width={100} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#1a5c3a"
              radius={[0, 4, 4, 0]}
              cursor={onBarClick ? "pointer" : undefined}
              onClick={(data) => {
                const payload = data as { payload?: { stage?: string }; stage?: string };
                const stage = payload.payload?.stage ?? payload.stage;
                if (stage && onBarClick) onBarClick(stage);
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {onBarClick && (
        <p className="text-center text-[11px] text-slate-400">
          Nhấn vào từng cột để xem danh sách cửa hàng
        </p>
      )}
    </div>
  );
}

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

const FUNNEL_DATA = [
  { stage: "Tổng cửa hàng", count: 560 },
  { stage: "Verify", count: 233 },
  { stage: "Đã nộp bằng chứng", count: 156 },
  { stage: "Verified", count: 42 },
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
            <XAxis type="number" />
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

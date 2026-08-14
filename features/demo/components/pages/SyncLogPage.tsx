import { DEMO_SYNC_JOBS, JOB_TYPE_LABELS } from "../../constants/demoSyncJobs";
import { SYNC_STATUS_LABELS } from "../../constants/demoStores";
import type { DemoRole } from "../../constants/demoRoles";
import { DemoCard } from "../ui/DemoCard";
import { DemoBadge } from "../ui/DemoBadge";

export function SyncLogPage({ role }: { role: Extract<DemoRole, "admin" | "manager"> }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Nhật ký bảng sync_jobs trên Supabase — queued, processing, success, failed.
        {role === "manager" ? " Manager xem chỉ đọc, không cấu hình quota / OAuth." : ""}
      </p>

      <DemoCard title="Hàng đợi đồng bộ">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Cửa hàng</th>
                <th className="px-3 py-2">Loại job</th>
                <th className="px-3 py-2">Trạng thái</th>
                <th className="px-3 py-2">Thời gian</th>
                <th className="px-3 py-2">Lỗi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEMO_SYNC_JOBS.map((job) => (
                <tr key={job.id}>
                  <td className="px-3 py-2 font-medium text-slate-800">{job.storeName}</td>
                  <td className="px-3 py-2 text-slate-600">{JOB_TYPE_LABELS[job.jobType]}</td>
                  <td className="px-3 py-2">
                    <DemoBadge
                      variant={
                        job.status === "success"
                          ? "success"
                          : job.status === "failed"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {SYNC_STATUS_LABELS[job.status]}
                    </DemoBadge>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-500">
                    {new Date(job.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-3 py-2 text-xs text-red-600">{job.errorMessage ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  );
}

import { STORE_NAP } from "../../constants/demoPanelData";
import { DemoCard } from "../ui/DemoCard";
import { DemoCallout } from "../ui/DemoCallout";
import { DemoActionButton } from "../ui/DemoActionButton";
import { DemoBadge } from "../ui/DemoBadge";

const FIELDS: { label: string; value: string }[] = [
  { label: "Name", value: STORE_NAP.name },
  { label: "Address", value: STORE_NAP.address },
  { label: "Phone", value: STORE_NAP.phone },
  { label: "Hours", value: STORE_NAP.hours },
  { label: "Category", value: STORE_NAP.category },
  { label: "Website", value: STORE_NAP.website },
  { label: "Google Place ID", value: STORE_NAP.placeId },
];

export function StoreNapInfo() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-sm text-slate-600">
        N.A.P (Name, Address, Phone) của cửa hàng được gán. Store Manager chỉ xem — không Mass
        Update. Sai lệch so với giấy phép phải gửi yêu cầu cho Manager.
      </p>

      <DemoCallout variant="info">
        Dữ liệu đọc từ bảng stores (RLS: chỉ hàng được gán). Lần sync gần nhất: {STORE_NAP.lastSynced}
      </DemoCallout>

      <DemoCard title="Thông tin N.A.P — CH 42">
        <dl className="space-y-4">
          {FIELDS.map((f) => (
            <div key={f.label} className="flex flex-col gap-0.5 border-b border-slate-100 pb-3 last:border-0">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{f.label}</dt>
              <dd className="text-sm text-slate-800">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-slate-500">
          Trạng thái sync: <DemoBadge variant="warning">Chưa đẩy Google</DemoBadge>
        </p>
        <DemoActionButton
          variant="outline"
          className="mt-6 w-full"
          title="Store Manager không sửa N.A.P. Gửi yêu cầu cho Manager — bản demo không ghi dữ liệu."
        >
          Yêu cầu sửa N.A.P
        </DemoActionButton>
      </DemoCard>
    </div>
  );
}

import { SchemaTableList } from "../infra/SchemaTableList";

export function DatabasePage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Supabase Postgres lưu text, metadata, trạng thái — không lưu file video/ảnh. RLS theo role
        Admin / Manager / Store Manager.
      </p>
      <SchemaTableList />
    </div>
  );
}

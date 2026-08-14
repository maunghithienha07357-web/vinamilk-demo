import { NextResponse } from "next/server";
import { fetchStoresFromDb, saveSnapshot } from "@/lib/ai/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const stores = await fetchStoresFromDb();
    if (!stores.length) {
      return NextResponse.json(
        { error: "Bảng vinamilk_demo_stores trống — chưa có cửa hàng để đồng bộ." },
        { status: 400 },
      );
    }
    const snapshot = await saveSnapshot(stores);
    return NextResponse.json({
      ok: true,
      storeCount: snapshot.store_count,
      syncedAt: snapshot.synced_at,
      stores: stores.map((s) => ({
        id: s.id,
        name: s.name,
        gbp_state: s.gbp_state,
        kanban_stage: s.kanban_stage,
        assigned_to_store_manager: s.assigned_to_store_manager,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Đồng bộ thất bại";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

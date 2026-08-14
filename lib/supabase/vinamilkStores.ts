import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  DEMO_STORES,
  type DemoStore,
  type GbpState,
  type KanbanStage,
  type SyncStatus,
} from "@/features/demo/constants/demoStores";

type StoreRow = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  category: string | null;
  hours: string | null;
  website: string | null;
  region: string;
  gbp_state: GbpState;
  kanban_stage: KanbanStage;
  sync_status: SyncStatus;
  google_place_id: string | null;
  lat: number;
  lng: number;
  rating: number | null;
  review_count: number | null;
  one_star_count: number | null;
  evidence_status: string | null;
  reason: string | null;
  assigned_to_store_manager: boolean;
};

function getBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function rowToStore(row: StoreRow): DemoStore {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    phone: row.phone ?? "",
    category: row.category ?? "Cửa hàng sữa",
    hours: row.hours ?? "8:00 - 21:00",
    website: row.website ?? "",
    region: row.region,
    gbpState: row.gbp_state,
    kanbanStage: row.kanban_stage,
    syncStatus: row.sync_status,
    googlePlaceId: row.google_place_id ?? "",
    lat: row.lat,
    lng: row.lng,
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    oneStarCount: row.one_star_count ?? 0,
    evidenceStatus: row.evidence_status ?? "",
    reason: row.reason ?? undefined,
    assignedToStoreManager: row.assigned_to_store_manager,
  };
}

/** Đọc 5 cửa hàng từ Supabase; nếu lỗi thì dùng mock cùng bộ dữ liệu. */
export async function fetchVinamilkDemoStores(): Promise<DemoStore[]> {
  const supabase = getBrowserClient();
  if (!supabase) return DEMO_STORES;

  const { data, error } = await supabase
    .from("vinamilk_demo_stores")
    .select("*")
    .order("name");

  if (error || !data?.length) return DEMO_STORES;
  return (data as StoreRow[]).map(rowToStore);
}

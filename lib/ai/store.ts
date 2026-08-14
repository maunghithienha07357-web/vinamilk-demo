import { createServiceClient } from "@/lib/supabase/admin";
import { decryptSecret } from "@/lib/crypto/secretCrypto";
import type { StoreSnapshot } from "@/lib/ai/roleContext";

export type AiConfigRow = {
  id: string;
  provider: string;
  model: string;
  api_key_cipher: string | null;
  key_hint: string | null;
  temperature: number;
  updated_at: string;
};

export type AiSnapshotRow = {
  id: string;
  payload: { stores?: StoreSnapshot[] };
  store_count: number;
  synced_at: string | null;
};

export type AiChatLogRow = {
  role: string;
  question: string;
  answer: string | null;
  model: string | null;
  latency_ms: number | null;
  created_at: string;
};

export async function loadAiConfig(): Promise<AiConfigRow | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("vinamilk_ai_config")
    .select("id, provider, model, api_key_cipher, key_hint, temperature, updated_at")
    .eq("id", "default")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as AiConfigRow | null;
}

export async function saveAiConfig(patch: {
  model?: string;
  api_key_cipher?: string | null;
  key_hint?: string | null;
  temperature?: number;
}): Promise<AiConfigRow> {
  const existing = await loadAiConfig();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("vinamilk_ai_config")
    .upsert(
      {
        id: "default",
        provider: "groq",
        model: patch.model ?? existing?.model ?? "llama-3.3-70b-versatile",
        api_key_cipher:
          patch.api_key_cipher !== undefined ? patch.api_key_cipher : existing?.api_key_cipher,
        key_hint: patch.key_hint !== undefined ? patch.key_hint : existing?.key_hint,
        temperature: patch.temperature ?? existing?.temperature ?? 0.3,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("id, provider, model, api_key_cipher, key_hint, temperature, updated_at")
    .single();
  if (error) throw new Error(error.message);
  return data as AiConfigRow;
}

export async function decryptStoredApiKey(): Promise<string | null> {
  const config = await loadAiConfig();
  if (!config?.api_key_cipher) return null;
  return decryptSecret(config.api_key_cipher);
}

export async function loadSnapshot(): Promise<AiSnapshotRow | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("vinamilk_ai_snapshot")
    .select("id, payload, store_count, synced_at")
    .eq("id", "default")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as AiSnapshotRow | null;
}

export async function fetchStoresFromDb(): Promise<StoreSnapshot[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("vinamilk_demo_stores")
    .select(
      "id, name, address, phone, category, hours, website, region, gbp_state, kanban_stage, sync_status, google_place_id, lat, lng, rating, review_count, one_star_count, evidence_status, reason, assigned_to_store_manager",
    )
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as StoreSnapshot[];
}

export async function saveSnapshot(stores: StoreSnapshot[]): Promise<AiSnapshotRow> {
  const supabase = createServiceClient();
  const syncedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("vinamilk_ai_snapshot")
    .upsert(
      {
        id: "default",
        payload: { stores },
        store_count: stores.length,
        synced_at: syncedAt,
      },
      { onConflict: "id" },
    )
    .select("id, payload, store_count, synced_at")
    .single();
  if (error) throw new Error(error.message);
  return data as AiSnapshotRow;
}

export async function loadStoresForChat(): Promise<{
  stores: StoreSnapshot[];
  syncedAt: string | null;
}> {
  const snapshot = await loadSnapshot();
  const fromSnap = snapshot?.payload?.stores;
  if (Array.isArray(fromSnap) && fromSnap.length) {
    return { stores: fromSnap, syncedAt: snapshot?.synced_at ?? null };
  }
  const stores = await fetchStoresFromDb();
  return { stores, syncedAt: null };
}

export async function insertChatLog(row: {
  role: string;
  question: string;
  answer: string;
  model: string;
  latency_ms: number;
}): Promise<void> {
  const supabase = createServiceClient();
  await supabase.from("vinamilk_ai_chat_logs").insert(row);
}

export async function loadRecentLogs(limit = 8): Promise<AiChatLogRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("vinamilk_ai_chat_logs")
    .select("role, question, answer, model, latency_ms, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as AiChatLogRow[];
}

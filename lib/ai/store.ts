import { createServiceClient } from "@/lib/supabase/admin";
import { decryptSecret, encryptSecret, keyHint } from "@/lib/crypto/secretCrypto";
import {
  getProvider,
  isAiProvider,
  isModelForProvider,
  type AiProviderId,
} from "@/lib/ai/providers";
import type { StoreSnapshot } from "@/lib/ai/roleContext";

export type AiConfigRow = {
  id: string;
  provider: string;
  model: string;
  api_key_cipher: string | null;
  key_hint: string | null;
  groq_key_cipher: string | null;
  groq_key_hint: string | null;
  gemini_key_cipher: string | null;
  gemini_key_hint: string | null;
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

const CONFIG_SELECT =
  "id, provider, model, api_key_cipher, key_hint, groq_key_cipher, groq_key_hint, gemini_key_cipher, gemini_key_hint, temperature, updated_at";

export function activeProvider(row: AiConfigRow): AiProviderId {
  return isAiProvider(row.provider) ? row.provider : "groq";
}

export function cipherFor(row: AiConfigRow, provider: AiProviderId): string | null {
  if (provider === "gemini") {
    return row.gemini_key_cipher ?? (row.provider === "gemini" ? row.api_key_cipher : null);
  }
  return row.groq_key_cipher ?? (row.provider === "groq" ? row.api_key_cipher : null);
}

export function hintFor(row: AiConfigRow, provider: AiProviderId): string | null {
  if (provider === "gemini") {
    return row.gemini_key_hint ?? (row.provider === "gemini" ? row.key_hint : null);
  }
  return row.groq_key_hint ?? (row.provider === "groq" ? row.key_hint : null);
}

export async function loadAiConfig(): Promise<AiConfigRow | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("vinamilk_ai_config")
    .select(CONFIG_SELECT)
    .eq("id", "default")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as AiConfigRow | null;
}

export async function saveAiConfig(patch: {
  provider?: AiProviderId;
  model?: string;
  apiKey?: string;
  temperature?: number;
}): Promise<AiConfigRow> {
  const existing = await loadAiConfig();
  const provider = patch.provider ?? (existing ? activeProvider(existing) : "groq");
  const meta = getProvider(provider);
  let model = patch.model ?? existing?.model ?? meta.defaultModel;
  if (!isModelForProvider(provider, model)) {
    model = meta.defaultModel;
  }

  let groqCipher = existing?.groq_key_cipher ?? null;
  let groqHint = existing?.groq_key_hint ?? null;
  let geminiCipher = existing?.gemini_key_cipher ?? null;
  let geminiHint = existing?.gemini_key_hint ?? null;

  if (!groqCipher && existing?.provider === "groq") {
    groqCipher = existing.api_key_cipher;
    groqHint = existing.key_hint;
  }
  if (!geminiCipher && existing?.provider === "gemini") {
    geminiCipher = existing.api_key_cipher;
    geminiHint = existing.key_hint;
  }

  if (patch.apiKey) {
    const cipher = encryptSecret(patch.apiKey);
    const hint = keyHint(patch.apiKey);
    if (provider === "gemini") {
      geminiCipher = cipher;
      geminiHint = hint;
    } else {
      groqCipher = cipher;
      groqHint = hint;
    }
  }

  const activeCipher = provider === "gemini" ? geminiCipher : groqCipher;
  const activeHint = provider === "gemini" ? geminiHint : groqHint;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("vinamilk_ai_config")
    .upsert(
      {
        id: "default",
        provider,
        model,
        api_key_cipher: activeCipher,
        key_hint: activeHint,
        groq_key_cipher: groqCipher,
        groq_key_hint: groqHint,
        gemini_key_cipher: geminiCipher,
        gemini_key_hint: geminiHint,
        temperature: patch.temperature ?? existing?.temperature ?? 0.3,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select(CONFIG_SELECT)
    .single();
  if (error) throw new Error(error.message);
  return data as AiConfigRow;
}

export async function decryptStoredApiKey(
  provider?: AiProviderId,
): Promise<string | null> {
  const config = await loadAiConfig();
  if (!config) return null;
  const id = provider ?? activeProvider(config);
  const cipher = cipherFor(config, id);
  if (!cipher) return null;
  return decryptSecret(cipher);
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

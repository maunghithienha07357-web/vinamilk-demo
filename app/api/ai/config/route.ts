import { NextResponse } from "next/server";
import { assertEncKey, encryptSecret, keyHint, maskApiKey } from "@/lib/crypto/secretCrypto";
import { GROQ_MODEL_IDS } from "@/lib/ai/groq";
import { loadAiConfig, loadRecentLogs, loadSnapshot, saveAiConfig } from "@/lib/ai/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function publicConfig(row: {
  provider: string;
  model: string;
  api_key_cipher: string | null;
  key_hint: string | null;
  temperature: number;
  updated_at: string;
}) {
  const hasKey = Boolean(row.api_key_cipher);
  return {
    provider: row.provider,
    model: row.model,
    hasKey,
    keyHint: row.key_hint,
    maskedKey: hasKey && row.key_hint ? `gsk_••••${row.key_hint}` : null,
    temperature: Number(row.temperature),
    updatedAt: row.updated_at,
  };
}

export async function GET() {
  try {
    const [config, snapshot, logs] = await Promise.all([
      loadAiConfig(),
      loadSnapshot(),
      loadRecentLogs(8),
    ]);
    if (!config) {
      return NextResponse.json({ error: "Chưa có bản ghi cấu hình AI" }, { status: 404 });
    }
    const stores = snapshot?.payload?.stores ?? [];
    return NextResponse.json({
      ...publicConfig(config),
      snapshot: {
        storeCount: snapshot?.store_count ?? 0,
        syncedAt: snapshot?.synced_at ?? null,
        stores: stores.map((s) => ({
          id: s.id,
          name: s.name,
          gbp_state: s.gbp_state,
          kanban_stage: s.kanban_stage,
          assigned_to_store_manager: s.assigned_to_store_manager,
        })),
      },
      recentLogs: logs.map((l) => ({
        role: l.role,
        question: l.question,
        model: l.model,
        latencyMs: l.latency_ms,
        createdAt: l.created_at,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không đọc được cấu hình";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    assertEncKey();
    const body = (await req.json()) as { apiKey?: string; model?: string; temperature?: number };
    const patch: {
      model?: string;
      api_key_cipher?: string;
      key_hint?: string;
      temperature?: number;
    } = {};

    if (typeof body.model === "string" && body.model.trim()) {
      if (!GROQ_MODEL_IDS.has(body.model.trim())) {
        return NextResponse.json({ error: "Model Groq không hợp lệ" }, { status: 400 });
      }
      patch.model = body.model.trim();
    }

    if (typeof body.temperature === "number" && Number.isFinite(body.temperature)) {
      patch.temperature = Math.min(1, Math.max(0, body.temperature));
    }

    if (typeof body.apiKey === "string" && body.apiKey.trim()) {
      const apiKey = body.apiKey.trim();
      if (!apiKey.startsWith("gsk_")) {
        return NextResponse.json(
          { error: "API key Groq phải bắt đầu bằng gsk_" },
          { status: 400 },
        );
      }
      patch.api_key_cipher = encryptSecret(apiKey);
      patch.key_hint = keyHint(apiKey);
    }

    if (!patch.model && !patch.api_key_cipher && patch.temperature === undefined) {
      return NextResponse.json({ error: "Không có thay đổi để lưu" }, { status: 400 });
    }

    const saved = await saveAiConfig(patch);
    return NextResponse.json({
      ok: true,
      ...publicConfig(saved),
      maskedPreview: patch.api_key_cipher
        ? maskApiKey(body.apiKey?.trim() ?? "")
        : saved.key_hint
          ? `gsk_••••${saved.key_hint}`
          : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không lưu được cấu hình";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

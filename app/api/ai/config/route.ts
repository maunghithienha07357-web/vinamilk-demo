import { NextResponse } from "next/server";
import { assertEncKey, maskApiKey } from "@/lib/crypto/secretCrypto";
import { isSuperadminRequest, unauthorized } from "@/lib/ai/superadminAuth";
import {
  AI_PROVIDER_LIST,
  getProvider,
  inferProviderFromKey,
  isAiProvider,
  isModelForProvider,
  maskedKeyFor,
  validateApiKey,
  type AiProviderId,
} from "@/lib/ai/providers";
import {
  activeProvider,
  cipherFor,
  hintFor,
  loadAiConfig,
  loadRecentLogs,
  loadSnapshot,
  saveAiConfig,
  type AiConfigRow,
} from "@/lib/ai/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function keyStatus(row: AiConfigRow, provider: AiProviderId) {
  const hint = hintFor(row, provider);
  const hasKey = Boolean(cipherFor(row, provider));
  return {
    hasKey,
    keyHint: hint,
    maskedKey: hasKey ? maskedKeyFor(provider, hint) : null,
  };
}

function publicConfig(row: AiConfigRow) {
  const provider = activeProvider(row);
  const active = keyStatus(row, provider);
  return {
    provider,
    model: row.model,
    hasKey: active.hasKey,
    keyHint: active.keyHint,
    maskedKey: active.maskedKey,
    temperature: Number(row.temperature),
    updatedAt: row.updated_at,
    keys: Object.fromEntries(AI_PROVIDER_LIST.map((id) => [id, keyStatus(row, id)])),
  };
}

export async function GET(req: Request) {
  if (!isSuperadminRequest(req)) return unauthorized();
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
  if (!isSuperadminRequest(req)) return unauthorized();
  try {
    const body = (await req.json()) as {
      apiKey?: string;
      model?: string;
      provider?: string;
      temperature?: number;
    };

    const provider = isAiProvider(body.provider) ? body.provider : undefined;
    const patch: {
      provider?: AiProviderId;
      model?: string;
      apiKey?: string;
      temperature?: number;
    } = {};

    if (provider) patch.provider = provider;

    const existing = await loadAiConfig();
    const pid: AiProviderId = provider ?? (existing ? activeProvider(existing) : "groq");

    if (typeof body.model === "string" && body.model.trim()) {
      const model = body.model.trim();
      if (!isModelForProvider(pid, model)) {
        return NextResponse.json(
          { error: `Model không hợp lệ cho ${getProvider(pid).label}` },
          { status: 400 },
        );
      }
      patch.model = model;
    }

    if (typeof body.temperature === "number" && Number.isFinite(body.temperature)) {
      patch.temperature = Math.min(1, Math.max(0, body.temperature));
    }

    if (typeof body.apiKey === "string" && body.apiKey.trim()) {
      assertEncKey();
      const inferred = inferProviderFromKey(body.apiKey);
      const keyProvider = inferred ?? pid;
      const invalid = validateApiKey(keyProvider, body.apiKey);
      if (invalid) {
        return NextResponse.json({ error: invalid }, { status: 400 });
      }
      patch.apiKey = body.apiKey.trim();
      patch.provider = keyProvider;
    }

    const willUse = patch.provider ?? pid;
    const existingCipher = existing ? cipherFor(existing, willUse) : null;
    if (!patch.apiKey && !existingCipher && (patch.provider || patch.model)) {
      return NextResponse.json(
        {
          error: `Chưa lưu API key ${getProvider(willUse).label}. Dán key vào ô rồi bấm Kiểm tra kết nối (sẽ tự lưu), không chỉ chọn provider/model.`,
        },
        { status: 400 },
      );
    }

    if (!patch.provider && !patch.model && !patch.apiKey && patch.temperature === undefined) {
      return NextResponse.json({ error: "Không có thay đổi để lưu" }, { status: 400 });
    }

    const saved = await saveAiConfig(patch);
    const pub = publicConfig(saved);
    return NextResponse.json({
      ok: true,
      ...pub,
      maskedPreview: patch.apiKey
        ? maskApiKey(patch.apiKey)
        : pub.maskedKey,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không lưu được cấu hình";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

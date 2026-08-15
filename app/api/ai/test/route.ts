import { NextResponse } from "next/server";
import { decryptSecret } from "@/lib/crypto/secretCrypto";
import {
  getProvider,
  inferProviderFromKey,
  isAiProvider,
  type AiProviderId,
} from "@/lib/ai/providers";
import { testProviderKey } from "@/lib/ai/openaiCompat";
import { activeProvider, cipherFor, loadAiConfig, saveAiConfig } from "@/lib/ai/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    let apiKey = "";
    let provider: AiProviderId | undefined;
    let model: string | undefined;
    try {
      const body = (await req.json()) as { apiKey?: string; provider?: string; model?: string };
      if (typeof body.apiKey === "string") apiKey = body.apiKey.trim();
      if (isAiProvider(body.provider)) provider = body.provider;
      if (typeof body.model === "string" && body.model.trim()) model = body.model.trim();
    } catch {
      apiKey = "";
    }

    const inferred = apiKey ? inferProviderFromKey(apiKey) : null;
    const config = await loadAiConfig();
    const pid = inferred ?? provider ?? (config ? activeProvider(config) : "groq");
    const label = getProvider(pid).label;
    const pastedKey = Boolean(apiKey);

    if (!apiKey) {
      const cipher = config ? cipherFor(config, pid) : null;
      if (!cipher) {
        return NextResponse.json(
          {
            ok: false,
            message: `Chưa có API key ${label} trong database. Dán key vào ô rồi bấm Kiểm tra kết nối — hệ thống sẽ tự lưu.`,
          },
          { status: 400 },
        );
      }
      apiKey = decryptSecret(cipher);
    }

    const result = await testProviderKey(pid, apiKey);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    let saved = false;
    if (pastedKey) {
      try {
        await saveAiConfig({ provider: pid, apiKey, ...(model ? { model } : {}) });
        saved = true;
      } catch (err) {
        const reason = err instanceof Error ? err.message : "không lưu được";
        return NextResponse.json({
          ok: true,
          saved: false,
          provider: pid,
          modelCount: result.modelCount,
          message: `Kết nối ${label} thành công nhưng CHƯA lưu key: ${reason}. Kiểm tra VINAMILK_AI_ENC_KEY trên server.`,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      saved,
      provider: pid,
      modelCount: result.modelCount,
      message: saved
        ? `Kết nối ${label} thành công — đã lưu key. Chatbot dùng ${label}.`
        : `Kết nối ${label} thành công — ${result.modelCount} model khả dụng.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không kiểm tra được kết nối";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

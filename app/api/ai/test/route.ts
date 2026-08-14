import { NextResponse } from "next/server";
import { decryptSecret } from "@/lib/crypto/secretCrypto";
import { getProvider, isAiProvider, type AiProviderId } from "@/lib/ai/providers";
import { testProviderKey } from "@/lib/ai/openaiCompat";
import { activeProvider, cipherFor, loadAiConfig } from "@/lib/ai/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    let apiKey = "";
    let provider: AiProviderId | undefined;
    try {
      const body = (await req.json()) as { apiKey?: string; provider?: string };
      if (typeof body.apiKey === "string") apiKey = body.apiKey.trim();
      if (isAiProvider(body.provider)) provider = body.provider;
    } catch {
      apiKey = "";
    }

    const config = await loadAiConfig();
    const pid = provider ?? (config ? activeProvider(config) : "groq");
    const label = getProvider(pid).label;

    if (!apiKey) {
      const cipher = config ? cipherFor(config, pid) : null;
      if (!cipher) {
        return NextResponse.json(
          {
            ok: false,
            message: `Chưa có API key ${label}. Dán key rồi lưu trước khi kiểm tra.`,
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
    return NextResponse.json({
      ok: true,
      message: `Kết nối ${label} thành công — ${result.modelCount} model khả dụng.`,
      modelCount: result.modelCount,
      provider: pid,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không kiểm tra được kết nối";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { decryptSecret } from "@/lib/crypto/secretCrypto";
import { testGroqKey } from "@/lib/ai/groq";
import { loadAiConfig } from "@/lib/ai/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    let apiKey = "";
    try {
      const body = (await req.json()) as { apiKey?: string };
      if (typeof body.apiKey === "string") apiKey = body.apiKey.trim();
    } catch {
      apiKey = "";
    }

    if (!apiKey) {
      const config = await loadAiConfig();
      if (!config?.api_key_cipher) {
        return NextResponse.json(
          { ok: false, message: "Chưa có API key. Dán key Groq rồi lưu trước khi kiểm tra." },
          { status: 400 },
        );
      }
      apiKey = decryptSecret(config.api_key_cipher);
    }

    const result = await testGroqKey(apiKey);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json({
      ok: true,
      message: `Kết nối Groq thành công — ${result.modelCount} model khả dụng.`,
      modelCount: result.modelCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không kiểm tra được kết nối";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

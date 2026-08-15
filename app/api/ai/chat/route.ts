import { NextResponse } from "next/server";
import { decryptSecret } from "@/lib/crypto/secretCrypto";
import { getProvider } from "@/lib/ai/providers";
import { AiProviderError, streamProviderChat } from "@/lib/ai/openaiCompat";
import { buildRoleContext, isDemoRole } from "@/lib/ai/roleContext";
import {
  insertChatLog,
  loadAiConfig,
  loadStoresForChat,
  resolveChatCredentials,
} from "@/lib/ai/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUESTION_LEN = 1500;

export async function POST(req: Request) {
  let body: { role?: string; question?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "JSON không hợp lệ" }, { status: 400 });
  }

  if (!isDemoRole(body.role)) {
    return NextResponse.json({ error: "Role không hợp lệ" }, { status: 400 });
  }
  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json({ error: "Thiếu câu hỏi" }, { status: 400 });
  }
  if (question.length > MAX_QUESTION_LEN) {
    return NextResponse.json(
      { error: `Câu hỏi tối đa ${MAX_QUESTION_LEN} ký tự` },
      { status: 400 },
    );
  }

  let config;
  try {
    config = await loadAiConfig();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không đọc được cấu hình AI";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const creds = config ? resolveChatCredentials(config) : null;
  if (!creds) {
    return NextResponse.json(
      {
        error:
          "Chat AI chưa sẵn sàng: chưa lưu được API key vào database. Vào Cấu hình AI, dán key Gemini (AIza…) hoặc Groq (gsk_…), rồi bấm Kiểm tra kết nối — hệ thống sẽ tự lưu key.",
        code: "NOT_CONFIGURED",
      },
      { status: 400 },
    );
  }

  const { provider, cipher, model } = creds;
  const label = getProvider(provider).label;

  let apiKey: string;
  try {
    apiKey = decryptSecret(cipher);
  } catch {
    return NextResponse.json(
      { error: "Không giải mã được API key. Kiểm tra VINAMILK_AI_ENC_KEY trên server (Vercel + local phải cùng một key)." },
      { status: 500 },
    );
  }

  let stores;
  try {
    ({ stores } = await loadStoresForChat());
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không đọc được dữ liệu cửa hàng";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  if (!stores.length) {
    return NextResponse.json(
      {
        error: "Chưa có dữ liệu cửa hàng. Admin hãy bấm Đồng bộ database trên trang Cấu hình AI.",
        code: "NO_SNAPSHOT",
      },
      { status: 400 },
    );
  }

  const { system } = buildRoleContext(body.role, stores);
  const encoder = new TextEncoder();
  const started = Date.now();
  const role = body.role;
  const temperature = Number(config!.temperature ?? 0.3);

  const readable = new ReadableStream({
    async start(controller) {
      let answer = "";
      try {
        for await (const token of streamProviderChat({
          provider,
          apiKey,
          model,
          system,
          question,
          temperature,
        })) {
          answer += token;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
        await insertChatLog({
          role,
          question,
          answer,
          model,
          latency_ms: Date.now() - started,
        });
      } catch (err) {
        const message =
          err instanceof AiProviderError
            ? err.message
            : err instanceof Error
              ? err.message
              : `Lỗi khi gọi ${label}`;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

import { getProvider, type AiProviderId } from "@/lib/ai/providers";

export class AiProviderError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "AiProviderError";
    this.status = status;
  }
}

function providerMessage(provider: AiProviderId, status: number, body: string): string {
  const label = getProvider(provider).label;
  if (status === 401 || status === 403) {
    return provider === "gemini"
      ? "API key Gemini không hợp lệ hoặc chưa bật Generative Language API. Kiểm tra lại trên aistudio.google.com/apikey."
      : "API key Groq không hợp lệ. Kiểm tra lại key (bắt đầu bằng gsk_) trên console.groq.com.";
  }
  if (status === 429) {
    return `${label} đang giới hạn tốc độ (rate limit / quota). Đợi rồi thử lại, hoặc đổi model.`;
  }
  if (status === 404) {
    return `Model ${label} không tồn tại hoặc key không được phép dùng model này. Chọn model khác trên trang cấu hình.`;
  }
  const snippet = body.slice(0, 280).trim();
  return snippet ? `${label} lỗi ${status}: ${snippet}` : `${label} lỗi HTTP ${status}`;
}

export async function testProviderKey(
  provider: AiProviderId,
  apiKey: string,
): Promise<{ ok: true; modelCount: number } | { ok: false; message: string }> {
  const meta = getProvider(provider);
  try {
    const res = await fetch(meta.modelsUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, message: providerMessage(provider, res.status, text) };
    }
    const json = (await res.json()) as { data?: unknown[] };
    return { ok: true, modelCount: Array.isArray(json.data) ? json.data.length : 0 };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : `Không kết nối được ${meta.label}`,
    };
  }
}

export async function* streamProviderChat(opts: {
  provider: AiProviderId;
  apiKey: string;
  model: string;
  system: string;
  question: string;
  temperature?: number;
}): AsyncGenerator<string> {
  const meta = getProvider(opts.provider);
  const res = await fetch(meta.chatUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: opts.model,
      temperature: opts.temperature ?? 0.3,
      stream: true,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.question },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new AiProviderError(providerMessage(opts.provider, res.status, text), res.status);
  }
  if (!res.body) {
    throw new AiProviderError(`${meta.label} không trả về stream`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const json = JSON.parse(data) as {
          choices?: { delta?: { content?: string } }[];
        };
        const token = json.choices?.[0]?.delta?.content;
        if (typeof token === "string" && token) yield token;
      } catch {
        /* skip malformed SSE chunk */
      }
    }
  }
}

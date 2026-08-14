export type GroqModel = {
  id: string;
  label: string;
  speed: string;
  note: string;
};

export const GROQ_MODELS: GroqModel[] = [
  {
    id: "llama-3.3-70b-versatile",
    label: "Llama 3.3 70B Versatile",
    speed: "~280 t/s",
    note: "Mặc định — chất lượng tiếng Việt tốt nhất",
  },
  {
    id: "llama-3.1-8b-instant",
    label: "Llama 3.1 8B Instant",
    speed: "~560 t/s",
    note: "Nhanh nhất và rẻ nhất",
  },
  {
    id: "openai/gpt-oss-120b",
    label: "GPT-OSS 120B",
    speed: "~500 t/s",
    note: "Suy luận mạnh, context 131k",
  },
  {
    id: "openai/gpt-oss-20b",
    label: "GPT-OSS 20B",
    speed: "~1000 t/s",
    note: "Cân bằng tốc độ / chất lượng",
  },
  {
    id: "groq/compound",
    label: "Groq Compound",
    speed: "~450 t/s",
    note: "Có web search tích hợp",
  },
];

export const DEFAULT_GROQ_MODEL = GROQ_MODELS[0].id;

export const GROQ_MODEL_IDS = new Set(GROQ_MODELS.map((m) => m.id));

export class GroqError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "GroqError";
    this.status = status;
  }
}

function groqMessage(status: number, body: string): string {
  if (status === 401 || status === 403) {
    return "API key Groq không hợp lệ. Kiểm tra lại key (bắt đầu bằng gsk_) trên console.groq.com.";
  }
  if (status === 429) {
    return "Groq đang giới hạn tốc độ (rate limit). Đợi vài giây rồi thử lại.";
  }
  if (status === 404) {
    return "Model Groq không tồn tại hoặc đã bị gỡ. Chọn model khác trên trang cấu hình.";
  }
  const snippet = body.slice(0, 280).trim();
  return snippet ? `Groq lỗi ${status}: ${snippet}` : `Groq lỗi HTTP ${status}`;
}

export async function testGroqKey(
  apiKey: string,
): Promise<{ ok: true; modelCount: number } | { ok: false; message: string }> {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, message: groqMessage(res.status, text) };
    }
    const json = (await res.json()) as { data?: unknown[] };
    return { ok: true, modelCount: Array.isArray(json.data) ? json.data.length : 0 };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Không kết nối được Groq",
    };
  }
}

export async function* streamGroqChat(opts: {
  apiKey: string;
  model: string;
  system: string;
  question: string;
  temperature?: number;
}): AsyncGenerator<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
    throw new GroqError(groqMessage(res.status, text), res.status);
  }
  if (!res.body) {
    throw new GroqError("Groq không trả về stream");
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

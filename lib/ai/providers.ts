export type AiProviderId = "groq" | "gemini";

export type AiModel = {
  id: string;
  label: string;
  speed: string;
  note: string;
};

export type AiProvider = {
  id: AiProviderId;
  label: string;
  chatUrl: string;
  modelsUrl: string;
  defaultModel: string;
  keyPlaceholder: string;
  keyHint: string;
  docsUrl: string;
  models: AiModel[];
};

export const GROQ_MODELS: AiModel[] = [
  {
    id: "llama-3.3-70b-versatile",
    label: "Llama 3.3 70B Versatile",
    speed: "~280 t/s",
    note: "Mặc định Groq — tiếng Việt tốt nhất",
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

export const GEMINI_MODELS: AiModel[] = [
  {
    id: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    speed: "Nhanh",
    note: "Mặc định Gemini — miễn phí, tiếng Việt tốt",
  },
  {
    id: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    speed: "Chậm hơn",
    note: "Chất lượng / suy luận cao hơn",
  },
  {
    id: "gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
    speed: "Rất nhanh",
    note: "Ổn định, rẻ",
  },
  {
    id: "gemini-3.6-flash",
    label: "Gemini 3.6 Flash",
    speed: "Nhanh",
    note: "Model mới nhất trên OpenAI-compat docs",
  },
];

export const AI_PROVIDERS: Record<AiProviderId, AiProvider> = {
  groq: {
    id: "groq",
    label: "Groq",
    chatUrl: "https://api.groq.com/openai/v1/chat/completions",
    modelsUrl: "https://api.groq.com/openai/v1/models",
    defaultModel: "llama-3.3-70b-versatile",
    keyPlaceholder: "gsk_...",
    keyHint: "gsk_",
    docsUrl: "https://console.groq.com/docs/models",
    models: GROQ_MODELS,
  },
  gemini: {
    id: "gemini",
    label: "Google Gemini",
    chatUrl: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    modelsUrl: "https://generativelanguage.googleapis.com/v1beta/openai/models",
    defaultModel: "gemini-2.5-flash",
    keyPlaceholder: "AIza...",
    keyHint: "AIza",
    docsUrl: "https://ai.google.dev/gemini-api/docs/models",
    models: GEMINI_MODELS,
  },
};

export const AI_PROVIDER_LIST: AiProviderId[] = ["groq", "gemini"];

export function isAiProvider(value: unknown): value is AiProviderId {
  return value === "groq" || value === "gemini";
}

export function getProvider(id: string | null | undefined): AiProvider {
  return isAiProvider(id) ? AI_PROVIDERS[id] : AI_PROVIDERS.groq;
}

export function isModelForProvider(provider: AiProviderId, model: string): boolean {
  return AI_PROVIDERS[provider].models.some((m) => m.id === model);
}

export function validateApiKey(provider: AiProviderId, apiKey: string): string | null {
  const trimmed = apiKey.trim();
  if (!trimmed) return "Thiếu API key";
  if (provider === "groq" && !trimmed.startsWith("gsk_")) {
    return "API key Groq phải bắt đầu bằng gsk_";
  }
  if (provider === "gemini" && !trimmed.startsWith("AIza")) {
    return "API key Gemini thường bắt đầu bằng AIza — lấy tại aistudio.google.com/apikey";
  }
  return null;
}

export function maskedKeyFor(provider: AiProviderId, hint: string | null): string | null {
  if (!hint) return null;
  const prefix = AI_PROVIDERS[provider].keyHint;
  return `${prefix}••••${hint}`;
}

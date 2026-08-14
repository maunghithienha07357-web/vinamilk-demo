import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;

export class VinamilkSecretError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VinamilkSecretError";
  }
}

function loadKey(): Buffer {
  const raw = process.env.VINAMILK_AI_ENC_KEY?.trim();
  if (!raw) {
    throw new VinamilkSecretError("VINAMILK_AI_ENC_KEY missing or invalid");
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new VinamilkSecretError("VINAMILK_AI_ENC_KEY missing or invalid");
  }
  return key;
}

export function assertEncKey(): void {
  loadKey();
}

export function encryptSecret(plaintext: string): string {
  const key = loadKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decryptSecret(payload: string): string {
  const key = loadKey();
  const parts = payload.split(":");
  if (parts.length !== 3) {
    throw new VinamilkSecretError("Invalid encrypted secret payload");
  }
  const [ivB64, tagB64, cipherB64] = parts;
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(cipherB64, "base64");
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

export function maskApiKey(key: string): string {
  const trimmed = key.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 8) return "••••••••";
  const prefix = trimmed.startsWith("gsk_") ? "gsk_" : trimmed.startsWith("AIza") ? "AIza" : "";
  return `${prefix}••••${trimmed.slice(-4)}`;
}

export function keyHint(key: string): string {
  const trimmed = key.trim();
  if (trimmed.length < 4) return trimmed;
  return trimmed.slice(-4);
}

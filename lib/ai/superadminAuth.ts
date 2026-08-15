import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";

export const SUPERADMIN_COOKIE = "vinamilk_superadmin";

const SESSION_PAYLOAD = "vinamilk-superadmin-v1";

function cookieSecret(): string {
  return (
    process.env.VINAMILK_AI_ENC_KEY?.trim() ||
    process.env.SUPERADMIN_PASSWORD?.trim() ||
    "vinamilk-superadmin-dev"
  );
}

export function signSuperadminSession(): string {
  return createHmac("sha256", cookieSecret()).update(SESSION_PAYLOAD).digest("hex");
}

export function readSuperadminCookie(req: Request): string | null {
  const raw = req.headers.get("cookie") ?? "";
  const match = raw.match(new RegExp(`(?:^|;\\s*)${SUPERADMIN_COOKIE}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function isSuperadminRequest(req: Request): boolean {
  const token = readSuperadminCookie(req);
  if (!token) return false;
  const expected = signSuperadminSession();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function hashesEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

async function loadStoredHash(): Promise<string | null> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("vinamilk_superadmin")
      .select("password_hash")
      .eq("id", "default")
      .maybeSingle();
    if (error || !data?.password_hash) return null;
    return data.password_hash as string;
  } catch {
    return null;
  }
}

function verifyScrypt(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 2) return false;
  const [saltB64, hashB64] = parts;
  try {
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(hashB64, "base64");
    const actual = scryptSync(password, salt, expected.length);
    return hashesEqual(actual, expected);
  } catch {
    return false;
  }
}

export async function verifySuperadminPassword(password: string): Promise<boolean> {
  const trimmed = password.trim();
  if (!trimmed) return false;

  const stored = await loadStoredHash();
  if (stored && verifyScrypt(trimmed, stored)) return true;

  const envPassword = process.env.SUPERADMIN_PASSWORD?.trim();
  if (envPassword) {
    const a = Buffer.from(trimmed);
    const b = Buffer.from(envPassword);
    if (a.length === b.length && timingSafeEqual(a, b)) return true;
  }
  return false;
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Cần đăng nhập Superadmin tại /demo/superadmin" }, { status: 401 });
}

export function superadminCookieHeader(token: string, maxAgeSec: number): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SUPERADMIN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${secure}`;
}

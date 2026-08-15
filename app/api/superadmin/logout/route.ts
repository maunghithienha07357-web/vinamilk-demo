import { NextResponse } from "next/server";
import { superadminCookieHeader } from "@/lib/ai/superadminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", superadminCookieHeader("", 0));
  return res;
}

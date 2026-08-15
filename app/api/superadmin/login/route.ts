import { NextResponse } from "next/server";
import {
  signSuperadminSession,
  superadminCookieHeader,
  verifySuperadminPassword,
} from "@/lib/ai/superadminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = (await req.json()) as { password?: string };
    if (typeof body.password === "string") password = body.password;
  } catch {
    return NextResponse.json({ error: "JSON không hợp lệ" }, { status: 400 });
  }

  const ok = await verifySuperadminPassword(password);
  if (!ok) {
    return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", superadminCookieHeader(signSuperadminSession(), 60 * 60 * 24 * 7));
  return res;
}

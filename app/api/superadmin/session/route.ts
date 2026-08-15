import { NextResponse } from "next/server";
import { isSuperadminRequest } from "@/lib/ai/superadminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return NextResponse.json({ ok: isSuperadminRequest(req) });
}

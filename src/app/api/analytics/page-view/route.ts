import { NextResponse, type NextRequest } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VISITOR_COOKIE = "ainext_visitor";
const SESSION_COOKIE = "ainext_session";

function deviceFromUserAgent(userAgent: string) {
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return "tablet";
  if (/mobile|iphone|ipod|android/i.test(userAgent)) return "mobile";
  return "desktop";
}

function referrerHost(referrer: unknown, requestUrl: string) {
  if (typeof referrer !== "string" || !referrer) return null;
  try {
    const source = new URL(referrer);
    if (source.origin === new URL(requestUrl).origin) return null;
    return source.hostname.slice(0, 160) || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });

  let payload: { path?: unknown; referrer?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = typeof payload.path === "string"
    ? payload.path.split(/[?#]/, 1)[0].trim()
    : "";
  if (!path.startsWith("/") || path.length > 300) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const visitorId = UUID_PATTERN.test(request.cookies.get(VISITOR_COOKIE)?.value ?? "")
    ? request.cookies.get(VISITOR_COOKIE)!.value
    : crypto.randomUUID();
  const sessionId = UUID_PATTERN.test(request.cookies.get(SESSION_COOKIE)?.value ?? "")
    ? request.cookies.get(SESSION_COOKIE)!.value
    : crypto.randomUUID();

  const db = await createClient();
  const { error } = await db.rpc("record_page_view", {
    p_path: path,
    p_session_id: sessionId,
    p_visitor_id: visitorId,
    p_referrer_host: referrerHost(payload.referrer, request.url),
    p_device_type: deviceFromUserAgent(request.headers.get("user-agent") ?? ""),
  });

  if (error) return NextResponse.json({ ok: false }, { status: 500 });

  const response = NextResponse.json({ ok: true });
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
  response.cookies.set(VISITOR_COOKIE, visitorId, { ...cookieOptions, maxAge: 60 * 60 * 24 * 365 });
  response.cookies.set(SESSION_COOKIE, sessionId, { ...cookieOptions, maxAge: 60 * 30 });
  return response;
}

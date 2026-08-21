import { createHash } from "node:crypto";
import { after, NextResponse, type NextRequest } from "next/server";
import { allowAnalyticsRequest } from "@/lib/analytics-rate-limit";
import { getAdminClient } from "@/lib/supabase/admin";
import { normalizeVercelRegion } from "@/lib/vietnam-regions";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VISITOR_COOKIE = "ainext_visitor";
const SESSION_COOKIE = "ainext_session";
const OPT_OUT_COOKIE = "ainext_analytics_opt_out";
const MINIMUM_ENGAGED_MS = 5_000;

function isAnalyticsConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://your-project.supabase.co" &&
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

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

function requestFingerprint(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();
  const address = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent")?.slice(0, 180) || "unknown";
  return createHash("sha256").update(`${address}|${userAgent}`).digest("hex");
}

function isFirstPartyRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  return origin === request.nextUrl.origin && (!fetchSite || fetchSite === "same-origin");
}

export async function POST(request: NextRequest) {
  if (request.cookies.get(OPT_OUT_COOKIE)?.value === "1") {
    return NextResponse.json({ ok: true, skipped: true });
  }
  if (!isAnalyticsConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  if (!isFirstPartyRequest(request)) return NextResponse.json({ ok: false }, { status: 403 });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ ok: false }, { status: 415 });
  }
  if (!allowAnalyticsRequest(requestFingerprint(request), 15, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429, headers: { "Retry-After": "60" } });
  }

  let payload: { path?: unknown; referrer?: unknown; engaged_ms?: unknown };
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
  if (typeof payload.engaged_ms !== "number" || !Number.isFinite(payload.engaged_ms) || payload.engaged_ms < MINIMUM_ENGAGED_MS) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const visitorId = UUID_PATTERN.test(request.cookies.get(VISITOR_COOKIE)?.value ?? "")
    ? request.cookies.get(VISITOR_COOKIE)!.value
    : crypto.randomUUID();
  const sessionId = UUID_PATTERN.test(request.cookies.get(SESSION_COOKIE)?.value ?? "")
    ? request.cookies.get(SESSION_COOKIE)!.value
    : crypto.randomUUID();

  const location = normalizeVercelRegion(
    request.headers.get("x-vercel-ip-country"),
    request.headers.get("x-vercel-ip-country-region"),
  );
  const pageView = {
    p_path: path,
    p_session_id: sessionId,
    p_visitor_id: visitorId,
    p_referrer_host: referrerHost(payload.referrer, request.url),
    p_device_type: deviceFromUserAgent(request.headers.get("user-agent") ?? ""),
    p_country_code: location.countryCode,
    p_region_code: location.regionCode,
    p_province_name: location.provinceName,
  };

  // Analytics is best-effort and must never delay navigation for the visitor.
  after(async () => {
    await getAdminClient().rpc("record_page_view_v3", pageView as never);
  });

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

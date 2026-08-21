import { createHash } from "node:crypto";
import { after, NextResponse, type NextRequest } from "next/server";
import { allowAnalyticsRequest } from "@/lib/analytics-rate-limit";
import { getAdminClient } from "@/lib/supabase/admin";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VISITOR_COOKIE = "ainext_visitor";
const SESSION_COOKIE = "ainext_session";
const OPT_OUT_COOKIE = "ainext_analytics_opt_out";

function isAnalyticsConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://your-project.supabase.co" &&
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function isFirstPartyRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  return origin === request.nextUrl.origin && (!fetchSite || fetchSite === "same-origin");
}

function requestFingerprint(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();
  const address = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent")?.slice(0, 180) || "unknown";
  return createHash("sha256").update(`${address}|${userAgent}|engagement`).digest("hex");
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
  if (!allowAnalyticsRequest(requestFingerprint(request), 12, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429, headers: { "Retry-After": "60" } });
  }

  let payload: {
    path?: unknown;
    active_ms?: unknown;
    max_scroll_percent?: unknown;
    estimated_read_seconds?: unknown;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = typeof payload.path === "string" ? payload.path.split(/[?#]/, 1)[0].trim() : "";
  const activeMs = typeof payload.active_ms === "number" ? payload.active_ms : Number.NaN;
  const scroll = typeof payload.max_scroll_percent === "number" ? payload.max_scroll_percent : Number.NaN;
  const estimate = typeof payload.estimated_read_seconds === "number" ? payload.estimated_read_seconds : Number.NaN;
  if (
    !path.startsWith("/tutorials/") || path.length > 300 ||
    !Number.isFinite(activeMs) || activeMs < 5_000 || activeMs > 14_400_000 ||
    !Number.isFinite(scroll) || scroll < 0 || scroll > 100 ||
    !Number.isFinite(estimate) || estimate < 60 || estimate > 10_800
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const visitorId = request.cookies.get(VISITOR_COOKIE)?.value ?? "";
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  if (!UUID_PATTERN.test(visitorId) || !UUID_PATTERN.test(sessionId)) {
    return NextResponse.json({ ok: false, skipped: true }, { status: 202 });
  }

  after(async () => {
    await getAdminClient().rpc("record_article_engagement", {
      p_path: path,
      p_session_id: sessionId,
      p_visitor_id: visitorId,
      p_active_seconds: Math.round(activeMs / 1_000),
      p_max_scroll_percent: Math.round(scroll),
      p_estimated_read_seconds: Math.round(estimate),
    } as never);
  });

  return NextResponse.json({ ok: true });
}

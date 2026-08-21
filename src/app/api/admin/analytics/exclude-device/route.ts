import { NextResponse, type NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VISITOR_COOKIE = "ainext_visitor";
const OPT_OUT_COOKIE = "ainext_analytics_opt_out";
const ONE_YEAR = 60 * 60 * 24 * 365;

function isFirstPartyRequest(request: NextRequest) {
  return request.headers.get("origin") === request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  if (!isFirstPartyRequest(request)) {
    return NextResponse.json({ error: "Request không hợp lệ." }, { status: 403 });
  }

  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Phiên đăng nhập đã hết hạn." }, { status: 401 });

  const { data: profile } = await db.from("users").select("role").eq("id", user.id).single();
  if (!profile || !["admin", "editor"].includes(profile.role)) {
    return NextResponse.json({ error: "Tài khoản không có quyền quản trị." }, { status: 403 });
  }

  const storedVisitorId = request.cookies.get(VISITOR_COOKIE)?.value ?? "";
  const visitorId = UUID_PATTERN.test(storedVisitorId) ? storedVisitorId : crypto.randomUUID();

  try {
    const { error, count } = await getAdminClient()
      .from("page_views")
      .delete({ count: "exact" })
      .eq("visitor_id", visitorId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const response = NextResponse.json({ ok: true, removed_views: count ?? 0 });
    const cookieOptions = {
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ONE_YEAR,
    };
    response.cookies.set(VISITOR_COOKIE, visitorId, { ...cookieOptions, httpOnly: true });
    response.cookies.set(OPT_OUT_COOKIE, "1", { ...cookieOptions, httpOnly: false });
    return response;
  } catch {
    return NextResponse.json({ error: "Không thể loại trừ thiết bị khỏi analytics." }, { status: 503 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ count: 0 }, { status: 401 });

  const { count, error } = await db.from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);
  if (error) return NextResponse.json({ count: 0, available: false }, { status: 503 });

  return NextResponse.json({ count: count ?? 0, available: true }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}

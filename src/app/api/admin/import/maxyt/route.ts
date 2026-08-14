import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { importMaxytArticle, normalizeMaxytArticleUrl } from "@/lib/maxyt-importer";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

const requestSchema = z.object({
  url: z.string().trim().url(),
  copyrightConfirmed: z.literal(true),
});

function isMissingMigration(message: string) {
  return /source_url|source_site|source_imported_at|import_mode|copyright_confirmed/i.test(message);
}

export async function POST(request: Request) {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Phiên đăng nhập đã hết hạn." }, { status: 401 });

  const { data: profile } = await db.from("users").select("role,full_name").eq("id", user.id).single();
  if (!profile || !["admin", "editor"].includes(profile.role)) {
    return NextResponse.json({ error: "Tài khoản không có quyền nhập bài." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Hãy nhập URL hợp lệ và xác nhận quyền sử dụng nội dung." }, { status: 400 });
  }

  try {
    const sourceUrl = normalizeMaxytArticleUrl(parsed.data.url);
    const existing = await db.from("articles").select("id,title").eq("source_url", sourceUrl).maybeSingle();
    if (existing.error) {
      if (isMissingMigration(existing.error.message)) {
        return NextResponse.json({ error: "Database chưa hỗ trợ nhập nguồn. Hãy chạy migration 008_source_imports.sql trước." }, { status: 503 });
      }
      throw new Error(existing.error.message);
    }
    if (existing.data) {
      return NextResponse.json({
        error: "Bài nguồn này đã được nhập trước đó.",
        existing: { id: existing.data.id, title: existing.data.title, editUrl: `/admin/tutorials/${existing.data.id}` },
      }, { status: 409 });
    }

    const imported = await importMaxytArticle(sourceUrl, user.id);
    const baseSlug = slugify(imported.title) || `bai-nhap-${Date.now()}`;
    let slug = baseSlug;
    for (let suffix = 2; suffix <= 50; suffix += 1) {
      const collision = await db.from("articles").select("id").eq("slug", slug).maybeSingle();
      if (collision.error) throw new Error(collision.error.message);
      if (!collision.data) break;
      slug = `${baseSlug}-${suffix}`;
    }

    const now = new Date().toISOString();
    const insert = await db.from("articles").insert({
      author_id: user.id,
      title: imported.title,
      slug,
      excerpt: imported.excerpt,
      content: imported.content,
      content_blocks: imported.contentBlocks,
      cover_url: imported.coverUrl,
      category: imported.category,
      difficulty: "beginner",
      duration_minutes: imported.durationMinutes,
      tools: imported.tools,
      is_featured: false,
      status: "draft",
      article_type: "blog",
      published_at: null,
      seo_title: null,
      seo_description: null,
      author_name: profile.full_name?.trim() || "Đội ngũ AINextGen",
      author_bio: null,
      source_references: [{ label: `MaxYT – ${imported.title}`, url: imported.sourceUrl }],
      reviewed_at: null,
      source_url: imported.sourceUrl,
      source_site: "MaxYT",
      source_imported_at: now,
      import_mode: "full",
      copyright_confirmed: true,
      updated_at: now,
    }).select("id,title").single();

    if (insert.error) {
      if (insert.error.code === "23505") return NextResponse.json({ error: "Bài này vừa được nhập ở một phiên khác." }, { status: 409 });
      if (isMissingMigration(insert.error.message)) {
        return NextResponse.json({ error: "Database chưa hỗ trợ nhập nguồn. Hãy chạy migration 008_source_imports.sql trước." }, { status: 503 });
      }
      throw new Error(insert.error.message);
    }

    revalidatePath("/admin");
    revalidatePath("/admin/tutorials");
    return NextResponse.json({
      ok: true,
      id: insert.data.id,
      title: insert.data.title,
      editUrl: `/admin/tutorials/${insert.data.id}`,
      message: "Đã nhập bài và ảnh vào bản nháp.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể nhập bài từ MaxYT.";
    return NextResponse.json({ error: message }, { status: /chỉ hỗ trợ url/i.test(message) ? 400 : 502 });
  }
}

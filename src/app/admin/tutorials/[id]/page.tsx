import { notFound } from "next/navigation";
import { TutorialEditor } from "@/components/admin/tutorial-editor";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { AdminTutorial } from "@/types/admin";

export default async function EditTutorial({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) notFound();
  const { id } = await params;
  const db = await createClient();
  const baseFields = "id,title,slug,excerpt,content,content_blocks,cover_url,category,difficulty,duration_minutes,tools,is_featured,status,seo_title,seo_description,author_name,author_bio,source_references,reviewed_at,published_at,created_at,updated_at";
  const enriched = await db.from("articles").select(`${baseFields},source_url,source_site,source_imported_at,copyright_confirmed`).eq("id", id).single();
  const fallback = enriched.error && /source_url|source_site|source_imported_at|copyright_confirmed/i.test(enriched.error.message)
    ? await db.from("articles").select(baseFields).eq("id", id).single()
    : null;
  const data = fallback?.data ?? enriched.data;
  if (!data) notFound();
  return <><h1 className="text-3xl font-black">Chỉnh sửa tutorial</h1><p className="mt-2 text-black/50">Cập nhật nội dung, trạng thái xuất bản và thông tin SEO.</p><TutorialEditor tutorial={data as AdminTutorial} /></>;
}

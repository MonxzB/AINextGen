import { AdminTutorialManager } from "@/components/admin/admin-tutorial-manager";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { AdminTutorialRow } from "@/types/admin";

type SearchParams = Promise<{ q?:string; status?:string; category?:string; saved?:string }>;

export default async function AdminTutorials({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  let rows: AdminTutorialRow[] = [];
  if (isSupabaseConfigured()) {
    const { data } = await (await createClient()).from("articles").select("id,title,slug,category,status,published_at,updated_at,is_featured,difficulty,duration_minutes").order("updated_at", { ascending:false });
    rows = (data ?? []) as AdminTutorialRow[];
  }
  return <AdminTutorialManager rows={rows} configured={isSupabaseConfigured()} initialFilters={{q:params.q ?? "",status:params.status ?? "all",category:params.category ?? "all"}} saved={params.saved === "1"}/>;
}

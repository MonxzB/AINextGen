import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type ViewCountRow = { slug: string; view_count: number };

async function fetchTutorialViewCounts(): Promise<Record<string, number>> {
  const { data } = await getPublicClient().rpc("get_tutorial_view_counts");
  const map: Record<string, number> = {};
  if (Array.isArray(data)) {
    for (const row of data as ViewCountRow[]) {
      if (row.slug) map[row.slug] = Number(row.view_count) || 0;
    }
  }
  return map;
}

const cachedViewCounts = unstable_cache(
  fetchTutorialViewCounts,
  ["ainextgen-tutorial-view-counts-v1"],
  { revalidate: 300, tags: ["tutorials"] },
);

const loadViewCounts =
  process.env.NODE_ENV === "development"
    ? fetchTutorialViewCounts
    : cachedViewCounts;

export const getTutorialViewCounts = cache(
  async (): Promise<Record<string, number>> =>
    isSupabaseConfigured() ? loadViewCounts() : {},
);

import type { MetadataRoute } from "next";
import { getEnglishTutorialSummaries, getTutorialSummaries as getTutorials } from "@/lib/tutorial-data";
import { englishIndexingEnabled } from "@/lib/features";
import { absoluteUrl, siteConfig } from "@/lib/site";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const [tutorials,englishTutorials]=await Promise.all([getTutorials(),englishIndexingEnabled?getEnglishTutorialSummaries():Promise.resolve([])]);
  const contentLastModified=tutorials.reduce((latest,tutorial)=>{const updated=new Date(tutorial.updated_at||tutorial.published_at);return updated>latest?updated:latest;},new Date("2026-08-14"));
  const infoPaths=["/about","/contact","/privacy","/terms","/editorial-policy"];
  const info=infoPaths.map(path=>({url:absoluteUrl(path),lastModified:new Date("2026-08-14"),changeFrequency:"yearly" as const,priority:.4}));
  const englishInfo=infoPaths.map(path=>({url:absoluteUrl(`/en${path}`),lastModified:new Date("2026-08-25"),changeFrequency:"yearly" as const,priority:.4}));
  const vietnameseEntries:MetadataRoute.Sitemap=[
    {url:siteConfig.url,lastModified:contentLastModified,changeFrequency:"weekly",priority:1},
    {url:absoluteUrl("/tutorials"),lastModified:contentLastModified,changeFrequency:"weekly",priority:.9},
    ...info,...tutorials.map(t=>({url:absoluteUrl(`/tutorials/${t.slug}`),lastModified:new Date(t.updated_at||t.published_at),changeFrequency:"monthly" as const,priority:t.is_featured?.8:.7}))
  ];
  if(!englishIndexingEnabled)return vietnameseEntries;
  return [...vietnameseEntries,
    {url:absoluteUrl("/en"),lastModified:new Date("2026-08-25"),changeFrequency:"weekly",priority:.8},
    {url:absoluteUrl("/en/tutorials"),lastModified:contentLastModified,changeFrequency:"weekly",priority:.8},
    ...englishInfo,...englishTutorials.map(t=>({url:absoluteUrl(`/en/tutorials/${t.slug}`),lastModified:new Date(t.updated_at||t.published_at),changeFrequency:"monthly" as const,priority:t.is_featured?.7:.6}))
  ];
}

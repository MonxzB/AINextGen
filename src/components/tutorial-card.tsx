import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Eye, Sparkles } from "lucide-react";
import type { TutorialSummary } from "@/types/tutorial";

const levels={vi:{beginner:"Cơ bản",intermediate:"Trung cấp",advanced:"Nâng cao"},en:{beginner:"Beginner",intermediate:"Intermediate",advanced:"Advanced"}};

function formatViewCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(count);
}

function formatPublishedAgo(publishedAt: string, locale: "vi" | "en"): string {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(publishedAt).getTime()) / 1000));
  if (elapsedSeconds < 60) return locale === "vi" ? "Vừa đăng" : "Just published";
  const units = [
    ["year", 365 * 24 * 60 * 60],
    ["month", 30 * 24 * 60 * 60],
    ["day", 24 * 60 * 60],
    ["hour", 60 * 60],
    ["minute", 60],
  ] as const;
  const [unit, seconds] = units.find(([, size]) => elapsedSeconds >= size) ?? units.at(-1)!;
  const value = -Math.floor(elapsedSeconds / seconds);
  return new Intl.RelativeTimeFormat(locale === "vi" ? "vi-VN" : "en", { numeric: "always" }).format(value, unit);
}

export function TutorialCard({tutorial,locale="vi"}:{tutorial:TutorialSummary;locale?:"vi"|"en"}){
  const en=locale==="en";
  return <article className="content-auto card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-brand-500/50"><Link href={`${en?"/en":""}/tutorials/${tutorial.slug}`} prefetch className="block"><div className="tutorial-card-media relative grid aspect-[16/8] place-items-center overflow-hidden border-b border-white/10 bg-gradient-to-br from-brand-600/30 via-[#11182c] to-cyan-400/10">{tutorial.cover_url?<><Image src={tutorial.cover_url} alt={`${en?"Cover image for":"Ảnh bìa"} ${tutorial.title}`} fill unoptimized loading="lazy" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15"/></>:<><div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:28px_28px]"/><Sparkles className="relative text-cyan-300" size={38}/></>}<span className="tutorial-card-category absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-bold">{tutorial.category}</span></div><div className="p-5"><div className="flex items-center gap-3 text-xs text-black/45"><span>{levels[locale][tutorial.difficulty]}</span><span className="flex items-center gap-1"><Clock size={14}/>{formatPublishedAgo(tutorial.published_at,locale)}</span>{tutorial.view_count != null && tutorial.view_count > 0 && <span className="flex items-center gap-1"><Eye size={14}/>{formatViewCount(tutorial.view_count)} {en?"views":"lượt xem"}</span>}</div><h3 className="mt-3 text-xl font-black leading-snug group-hover:text-brand-700">{tutorial.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-black/55">{tutorial.excerpt}</p><div className="mt-5 flex items-center justify-between"><div className="flex flex-wrap gap-1">{tutorial.tools.slice(0,2).map((tool)=><span key={tool} className="tutorial-tool-badge rounded-md px-2 py-1 text-xs">{tool}</span>)}</div><ArrowUpRight className="text-brand-700" size={19}/></div></div></Link></article>;
}

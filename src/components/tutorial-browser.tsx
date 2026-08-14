"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Zap } from "lucide-react";
import { TutorialCard } from "@/components/tutorial-card";
import { getContentPillar } from "@/lib/content-pillars";
import { buildSearchRegex, matchesSearch } from "@/lib/search";
import type { TutorialSummary } from "@/types/tutorial";

type Filters={q:string;category:string;level:string};
const levelLabels={beginner:"Cơ bản",intermediate:"Trung cấp",advanced:"Nâng cao"};

function readFilters():Filters{const params=new URLSearchParams(window.location.search);return {q:params.get("q")??"",category:params.get("category")??"all",level:params.get("level")??"all"};}

export function TutorialBrowser({tutorials,initialFilters}:{tutorials:TutorialSummary[];initialFilters:Filters}){
  const searchParams=useSearchParams();
  const [filters,setFilters]=useState<Filters>(()=>({q:searchParams.get("q")??initialFilters.q,category:searchParams.get("category")??initialFilters.category,level:searchParams.get("level")??initialFilters.level}));
  const deferredQuery=useDeferredValue(filters.q);
  const categories=useMemo(()=>[...new Set(tutorials.map((tutorial)=>tutorial.category))],[tutorials]);
  const pillar=getContentPillar(filters.category==="all"?undefined:filters.category);
  const filtered=useMemo(()=>{const regex=buildSearchRegex(deferredQuery);return tutorials.filter((tutorial)=>matchesSearch(regex,tutorial.title,tutorial.excerpt,tutorial.category,tutorial.tools)&&(filters.category==="all"||tutorial.category.toLowerCase()===filters.category.toLowerCase())&&(filters.level==="all"||tutorial.difficulty===filters.level));},[tutorials,deferredQuery,filters.category,filters.level]);
  const hasFilters=Boolean(filters.q||filters.category!=="all"||filters.level!=="all");
  const title=pillar?.label??"Thư viện tutorial AI";
  const description=pillar?.description??"Học từng bước, hiểu bản chất và áp dụng AI vào công việc thật.";

  function syncUrl(next:Filters,mode:"push"|"replace"="replace"){const url=new URL(window.location.href);[["q",next.q],["category",next.category==="all"?"":next.category],["level",next.level==="all"?"":next.level]].forEach(([key,value])=>value?url.searchParams.set(key,value):url.searchParams.delete(key));window.history[mode==="push"?"pushState":"replaceState"]({},"",`${url.pathname}${url.search}`);window.dispatchEvent(new Event("knowledge-url-change"));}
  function updateFilters(patch:Partial<Filters>,mode:"push"|"replace"="replace"){const next={...filters,...patch};setFilters(next);syncUrl(next,mode);}
  function chooseCategory(category:string){const next={...filters,q:"",category,level:"all"};setFilters(next);syncUrl(next,"push");}
  function clearFilters(){const next={q:"",category:"all",level:"all"};setFilters(next);syncUrl(next,"push");}

  useEffect(()=>{const handleFilter=(event:Event)=>{const category=(event as CustomEvent<{category:string}>).detail.category||"all";setFilters({q:"",category,level:"all"});};const handlePop=()=>setFilters(readFilters());window.addEventListener("knowledge-content-filter",handleFilter);window.addEventListener("popstate",handlePop);return()=>{window.removeEventListener("knowledge-content-filter",handleFilter);window.removeEventListener("popstate",handlePop);};},[]);
  useEffect(()=>{document.title=`${title} | AINextGen`;},[title]);

  return <>
    <div className="flex flex-wrap items-center gap-2"><p className="font-bold text-brand-700">{pillar?"Knowledge collection":"Knowledge hub"}</p><span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-500"><Zap size={11}/> Chuyển tức thì</span></div>
    <h1 className="mt-2 text-4xl font-black sm:text-5xl">{title}</h1>
    <p className="mt-4 max-w-2xl text-lg leading-8 text-black/55">{description}</p>

    <nav aria-label="Lọc kho kiến thức" className="mt-8 flex gap-2 overflow-x-auto pb-2"><Link href="/tutorials" onClick={(event)=>{event.preventDefault();chooseCategory("all");}} aria-current={filters.category==="all"?"page":undefined} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${filters.category==="all"?"bg-brand-600 text-white":"bg-white hover:text-brand-700"}`}>Tất cả</Link>{categories.map((category)=><Link key={category} href={`/tutorials?category=${encodeURIComponent(category)}`} onClick={(event)=>{event.preventDefault();chooseCategory(category);}} aria-current={filters.category.toLowerCase()===category.toLowerCase()?"page":undefined} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${filters.category.toLowerCase()===category.toLowerCase()?"bg-brand-600 text-white":"bg-white hover:text-brand-700"}`}>{getContentPillar(category)?.label??category}</Link>)}</nav>

    <div className="card mt-5 grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_190px_auto]">
      <label className="relative block"><span className="sr-only">Tìm trong kho kiến thức</span><Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-black/40" size={18}/><input className="input !pl-12 !pr-10" type="search" value={filters.q} onChange={(event)=>updateFilters({q:event.target.value})} placeholder="Tìm tutorial, prompt, công cụ..."/></label>
      <label className="relative block"><span className="sr-only">Lọc theo cấp độ</span><SlidersHorizontal aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-black/40" size={17}/><select className="input !pl-12 !pr-10" value={filters.level} onChange={(event)=>updateFilters({level:event.target.value},"push")}><option value="all">Mọi cấp độ</option>{Object.entries(levelLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <button type="button" onClick={clearFilters} disabled={!hasFilters} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40">Đặt lại</button>
    </div>

    <div className="mt-5 flex items-center justify-between text-sm text-black/50" aria-live="polite"><span>Tìm thấy <b className="text-ink">{filtered.length}</b> nội dung</span>{deferredQuery!==filters.q&&<span className="text-brand-700">Đang lọc...</span>}</div>
    {filtered.length?<div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((tutorial)=><TutorialCard key={tutorial.id} tutorial={tutorial}/>)}</div>:<div className="card mt-5 p-12 text-center"><h2 className="text-xl font-black">Chưa tìm thấy nội dung phù hợp</h2><p className="mt-2 text-black/50">Thử từ khóa, chủ đề hoặc cấp độ khác nhé.</p><button type="button" onClick={clearFilters} className="mt-4 font-bold text-brand-700">Xóa toàn bộ bộ lọc</button></div>}
  </>;
}

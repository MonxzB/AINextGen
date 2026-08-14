"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, FilePenLine, Plus, Search, Sparkles, Zap } from "lucide-react";
import { DeleteTutorialButton } from "@/components/admin/delete-tutorial-button";
import { getContentPillar } from "@/lib/content-pillars";
import { buildSearchRegex, matchesSearch } from "@/lib/search";
import type { AdminTutorialRow } from "@/types/admin";

type Filters = { q:string; status:string; category:string };
const date = new Intl.DateTimeFormat("vi-VN", { day:"2-digit", month:"2-digit", year:"numeric" });

function StatusBadge({ status }: { status: string }) {
  const published = status === "published";
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${published ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}`}>{published ? <CheckCircle2 size={13}/> : <FilePenLine size={13}/>} {published ? "Đã đăng" : "Bản nháp"}</span>;
}

function readFilters(): Filters {
  const params = new URLSearchParams(window.location.search);
  return {q:params.get("q") ?? "",status:params.get("status") ?? "all",category:params.get("category") ?? "all"};
}

export function AdminTutorialManager({ rows, configured, initialFilters, saved }: { rows:AdminTutorialRow[]; configured:boolean; initialFilters:Filters; saved:boolean }) {
  const [filters, setFilters] = useState(initialFilters);
  const categories = useMemo(() => [...new Set(rows.map((row) => row.category).filter(Boolean))].sort((a,b) => a.localeCompare(b,"vi")), [rows]);
  const pillar = getContentPillar(filters.category === "all" ? undefined : filters.category);
  const filtered = useMemo(() => {const regex=buildSearchRegex(filters.q);return rows.filter((row) => matchesSearch(regex,row.title,row.slug,row.category) && (filters.status === "all" || row.status === filters.status) && (filters.category === "all" || row.category === filters.category));}, [rows, filters]);
  const hasFilters = Boolean(filters.q || filters.status !== "all" || filters.category !== "all");

  function syncUrl(next: Filters, mode: "push"|"replace" = "replace") {
    const url = new URL(window.location.href);
    [["q",next.q],["status",next.status === "all" ? "" : next.status],["category",next.category === "all" ? "" : next.category]].forEach(([key,value]) => value ? url.searchParams.set(key,value) : url.searchParams.delete(key));
    url.searchParams.delete("saved");
    window.history[mode === "push" ? "pushState" : "replaceState"]({}, "", `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new Event("admin-url-change"));
  }

  function updateFilters(patch: Partial<Filters>, mode: "push"|"replace" = "replace") {
    const next={...filters,...patch};
    setFilters(next);
    syncUrl(next,mode);
  }

  useEffect(() => {
    const handleContentFilter = (event: Event) => {const category=(event as CustomEvent<{category:string}>).detail.category || "all";setFilters((current) => ({...current,q:"",status:"all",category}));};
    const handlePopState = () => setFilters(readFilters());
    window.addEventListener("admin-content-filter", handleContentFilter);
    window.addEventListener("popstate", handlePopState);
    return () => {window.removeEventListener("admin-content-filter", handleContentFilter);window.removeEventListener("popstate", handlePopState);};
  }, []);

  function clearFilters() {const next={q:"",status:"all",category:"all"};setFilters(next);syncUrl(next,"push");}

  return <>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold text-brand-700">{pillar ? `KHO ${pillar.label.toLocaleUpperCase("vi")}` : "CONTENT HUB"}</p><span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-500"><Zap size={11}/> Lọc tức thì</span></div><h1 className="mt-1 text-3xl font-black">{pillar ? `Quản lý ${pillar.label}` : "Tất cả nội dung AI"}</h1><p className="mt-2 text-black/50">{pillar?.description ?? "Tìm, chỉnh sửa và kiểm soát trạng thái toàn bộ nội dung."}</p></div><Link href={`/admin/tutorials/new${pillar ? `?category=${encodeURIComponent(pillar.category)}` : ""}`} className="btn-primary gap-2"><Plus size={18}/> {pillar ? `Viết bài ${pillar.label}` : "Tạo nội dung"}</Link></div>
    {saved && <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-500"><CheckCircle2 size={18}/> Tutorial đã được lưu thành công.</div>}
    {!configured && <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><b>Chế độ xem trước:</b> kết nối Supabase để quản lý nội dung thật.</div>}

    <div className="card mt-6 grid gap-3 p-4 md:grid-cols-[minmax(240px,1fr)_180px_180px_auto]">
      <label className="relative"><span className="sr-only">Tìm tutorial</span><Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40" size={18}/><input className="input pl-11" value={filters.q} onChange={(event) => updateFilters({q:event.target.value})} placeholder="Tìm tiêu đề, slug, chủ đề..." /></label>
      <select className="input" value={filters.status} onChange={(event) => updateFilters({status:event.target.value})} aria-label="Lọc trạng thái"><option value="all">Mọi trạng thái</option><option value="published">Đã đăng</option><option value="draft">Bản nháp</option></select>
      <select className="input" value={filters.category} onChange={(event) => updateFilters({category:event.target.value},"push")} aria-label="Lọc chủ đề"><option value="all">Mọi chủ đề</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>
      <button type="button" onClick={clearFilters} disabled={!hasFilters} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40">Đặt lại</button>
    </div>

    <div className="mt-4 flex items-center justify-between gap-3 text-sm text-black/50" aria-live="polite"><span><b className="text-ink">{filtered.length}</b> / {rows.length} nội dung</span>{hasFilters && <button type="button" onClick={clearFilters} className="font-bold text-brand-700">Xóa bộ lọc</button>}</div>

    <div className="mt-4 grid gap-3 md:hidden">
      {filtered.map((row) => <article key={row.id} className="card p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><Link href={`/admin/tutorials/${row.id}?category=${encodeURIComponent(row.category)}`} className="line-clamp-2 font-black hover:text-brand-700">{row.title}</Link><p className="mt-1 truncate text-xs text-black/40">/{row.slug}</p></div>{row.is_featured && <Sparkles className="shrink-0 text-brand-700" size={18}/>}</div><div className="mt-4 flex flex-wrap items-center gap-2"><StatusBadge status={row.status}/><span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-black/50">{row.category}</span><span className="text-xs text-black/40">{row.duration_minutes} phút</span></div><div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3"><span className="text-xs text-black/40">Sửa {date.format(new Date(row.updated_at))}</span><div className="flex items-center gap-1"><Link href={`/admin/tutorials/${row.id}?category=${encodeURIComponent(row.category)}`} className="rounded-lg px-2 py-1.5 text-sm font-bold text-brand-700 hover:bg-white/5">Sửa</Link>{row.status === "published" && <Link href={`/tutorials/${row.slug}`} target="_blank" className="rounded-lg p-2 text-black/50 hover:bg-white/5" aria-label={`Xem ${row.title}`}><Eye size={16}/></Link>}<DeleteTutorialButton id={row.id} title={row.title}/></div></div></article>)}
    </div>

    <div className="card mt-4 hidden overflow-hidden md:block"><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-white/5 text-xs uppercase tracking-wide text-black/40"><tr><th className="p-4">Nội dung</th><th className="p-4">Chủ đề</th><th className="p-4">Trạng thái</th><th className="p-4">Cập nhật</th><th className="p-4 text-right">Thao tác</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.id} className="border-t border-white/10 hover:bg-white/5"><td className="p-4"><div className="flex items-center gap-2"><Link href={`/admin/tutorials/${row.id}?category=${encodeURIComponent(row.category)}`} className="max-w-md font-bold hover:text-brand-700">{row.title}</Link>{row.is_featured && <Sparkles className="shrink-0 text-brand-700" size={15}/>}</div><p className="mt-1 text-xs text-black/40">/{row.slug} · {row.duration_minutes} phút</p></td><td className="p-4 text-black/50">{row.category}</td><td className="p-4"><StatusBadge status={row.status}/></td><td className="p-4 text-black/50">{date.format(new Date(row.updated_at))}</td><td className="p-4"><div className="flex items-center justify-end gap-1"><Link href={`/admin/tutorials/${row.id}?category=${encodeURIComponent(row.category)}`} className="rounded-lg px-2 py-1.5 font-bold text-brand-700 hover:bg-white/5">Sửa</Link>{row.status === "published" && <Link href={`/tutorials/${row.slug}`} target="_blank" className="rounded-lg p-2 text-black/50 hover:bg-white/5" aria-label={`Xem ${row.title}`}><Eye size={16}/></Link>}<DeleteTutorialButton id={row.id} title={row.title}/></div></td></tr>)}{filtered.length === 0 && <tr><td colSpan={5} className="p-12 text-center"><Search className="mx-auto text-black/35"/><p className="mt-3 font-bold">Không tìm thấy nội dung phù hợp</p><p className="mt-1 text-sm text-black/50">Thử chủ đề hoặc từ khóa khác nhé.</p></td></tr>}</tbody></table></div></div>
  </>;
}

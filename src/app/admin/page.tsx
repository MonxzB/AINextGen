import Link from "next/link";
import { ArrowRight, BookOpen, Eye, FilePenLine, Plus, Sparkles } from "lucide-react";
import { AnalyticsPanel, type AnalyticsOverview } from "@/components/admin/analytics-panel";
import { contentPillars } from "@/lib/content-pillars";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type RecentArticle = { id:string; title:string; slug:string; status:string; category:string; updated_at:string };
const date = new Intl.DateTimeFormat("vi-VN", { day:"2-digit", month:"2-digit", year:"numeric" });

export default async function AdminPage() {
  let all: {status:string;is_featured:boolean;category:string}[] = [];
  let recent: RecentArticle[] = [];
  let analytics: AnalyticsOverview | null = null;
  if (isSupabaseConfigured()) {
    const db = await createClient();
    const [statsResult, recentResult, analyticsResult] = await Promise.all([
      db.from("articles").select("status,is_featured,category"),
      db.from("articles").select("id,title,slug,status,category,updated_at").order("updated_at", { ascending:false }).limit(6),
      db.rpc("get_analytics_overview", { p_days: 30 }),
    ]);
    all = statsResult.data ?? [];
    recent = (recentResult.data ?? []) as RecentArticle[];
    analytics = analyticsResult.data as AnalyticsOverview | null;
  }
  const total = all.length;
  const published = all.filter((item) => item.status === "published").length;
  const drafts = all.filter((item) => item.status === "draft").length;
  const featured = all.filter((item) => item.is_featured).length;
  const topics = new Set(all.map((item) => item.category).filter(Boolean)).size;
  const stats = [[BookOpen,"Tổng tutorial",total],[Eye,"Đã xuất bản",published],[FilePenLine,"Bản nháp",drafts],[Sparkles,"Bài nổi bật",featured]] as const;

  return <>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-brand-700">AINEXTGEN KNOWLEDGE CMS</p><h1 className="mt-1 text-3xl font-black">Tổng quan nội dung</h1><p className="mt-2 text-black/50">Theo dõi kho kiến thức và tiếp tục công việc nhanh chóng.</p></div><Link href="/admin/tutorials/new" className="btn-primary gap-2"><Plus size={18}/> Viết tutorial mới</Link></div>
    {!isSupabaseConfigured() && <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900"><b>Chế độ xem trước.</b> Website đang dùng tutorial demo. Kết nối Supabase để viết và xuất bản nội dung thật.</div>}
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([Icon,label,value]) => <div key={label} className="card p-5"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-brand-500/15 text-brand-700"><Icon size={20}/></span><span className="text-xs font-bold text-black/40">{total ? `${Math.round((Number(value)/total)*100)}%` : "—"}</span></div><p className="mt-5 text-3xl font-black">{value}</p><p className="mt-1 text-sm text-black/50">{label}</p></div>)}</div>

    <AnalyticsPanel data={analytics} compact/>

    <section className="mt-6"><div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-black">Kho nội dung chính</h2><p className="mt-1 text-sm text-black/50">Prompt, Automation và Lộ trình được quản lý riêng nhưng dùng chung một CMS.</p></div></div><div className="mt-4 grid gap-4 md:grid-cols-3">{contentPillars.map((pillar) => {const count=all.filter((item) => item.category.toLocaleLowerCase("vi")===pillar.category.toLocaleLowerCase("vi")).length;return <article key={pillar.key} className="card p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-lg font-black">{pillar.label}</p><p className="mt-2 text-sm leading-6 text-black/50">{pillar.description}</p></div><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-lg font-black text-brand-700">{count}</span></div><div className="mt-5 flex items-center gap-3"><Link href={`/admin/tutorials?category=${encodeURIComponent(pillar.category)}`} className="text-sm font-bold text-brand-700">Quản lý <ArrowRight className="inline" size={14}/></Link><Link href={`/admin/tutorials/new?category=${encodeURIComponent(pillar.category)}`} className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-black/50 hover:text-brand-700"><Plus size={14}/> Tạo mới</Link></div></article>})}</div></section>

    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <section className="card overflow-hidden"><div className="flex items-center justify-between border-b border-white/10 p-5"><div><h2 className="font-black">Nội dung gần đây</h2><p className="mt-1 text-sm text-black/50">Các bài vừa được cập nhật</p></div><Link href="/admin/tutorials" className="inline-flex items-center gap-1 text-sm font-bold text-brand-700">Xem tất cả <ArrowRight size={15}/></Link></div><div>{recent.map((item) => <Link key={item.id} href={`/admin/tutorials/${item.id}`} className="flex items-center gap-4 border-b border-white/10 p-4 transition last:border-0 hover:bg-white/5"><span className={`size-2 shrink-0 rounded-full ${item.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`}/><div className="min-w-0 flex-1"><p className="truncate font-bold">{item.title}</p><p className="mt-1 text-xs text-black/40">{item.category} · {date.format(new Date(item.updated_at))}</p></div><span className="hidden text-xs font-semibold text-black/40 sm:block">{item.status === "published" ? "Đã đăng" : "Bản nháp"}</span><ArrowRight className="shrink-0 text-black/35" size={17}/></Link>)}{recent.length === 0 && <div className="p-10 text-center"><BookOpen className="mx-auto text-black/35"/><p className="mt-3 font-bold">Chưa có nội dung trong database</p><Link href="/admin/tutorials/new" className="mt-3 inline-flex text-sm font-bold text-brand-700">Tạo tutorial đầu tiên →</Link></div>}</div></section>
      <aside className="space-y-4"><section className="card p-5"><h2 className="font-black">Tình trạng kho bài</h2><div className="mt-5 space-y-4"><div><div className="flex justify-between text-sm"><span className="text-black/50">Tỷ lệ xuất bản</span><b>{total ? Math.round((published/total)*100) : 0}%</b></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400" style={{width:`${total ? (published/total)*100 : 0}%`}}/></div></div><div className="flex justify-between border-t border-white/10 pt-4 text-sm"><span className="text-black/50">Chủ đề đang có</span><b>{topics}</b></div></div></section><section className="card p-5"><h2 className="font-black">Thao tác nhanh</h2><div className="mt-3 grid gap-2"><Link href="/admin/tutorials/new" className="btn-primary gap-2"><Plus size={17}/> Tạo tutorial</Link><Link href="/admin/tutorials?status=draft" className="btn-secondary gap-2"><FilePenLine size={17}/> Xem bản nháp</Link><Link href="/" target="_blank" className="btn-secondary gap-2"><Eye size={17}/> Mở website</Link></div></section></aside>
    </div>
  </>;
}

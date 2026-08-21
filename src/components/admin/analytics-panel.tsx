import Link from "next/link";
import {
  Activity, CalendarDays, Eye, Monitor, MousePointerClick,
  Smartphone, Tablet, TrendingDown, TrendingUp, Users,
} from "lucide-react";

export type AnalyticsOverview = {
  period_days: number;
  total_views: number;
  previous_views: number;
  unique_visitors: number;
  sessions: number;
  today_views: number;
  pages_per_session: number;
  daily: { date: string; views: number; visitors: number }[];
  top_pages: { path: string; views: number }[];
  referrers: { source: string; views: number }[];
  devices: { device: "desktop" | "mobile" | "tablet"; views: number }[];
};

const number = new Intl.NumberFormat("vi-VN");
const shortDate = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" });

function percentage(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

export function AnalyticsPanel({ data, compact = false }: { data: AnalyticsOverview | null; compact?: boolean }) {
  if (!data) {
    return <section className="card mt-6 p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-brand-500/15 text-brand-700"><Activity size={21}/></span>
        <div><h2 className="font-black">Phân tích lưu lượng</h2><p className="mt-1 text-sm text-black/50">Chạy migration 006 để bắt đầu thu thập dữ liệu truy cập.</p></div>
      </div>
    </section>;
  }

  const maxDaily = Math.max(1, ...data.daily.map((day) => day.views));
  const maxPage = Math.max(1, ...data.top_pages.map((page) => page.views));
  const change = data.previous_views > 0
    ? Math.round(((data.total_views - data.previous_views) / data.previous_views) * 100)
    : data.total_views > 0 ? 100 : 0;
  const statCards = [
    [Eye, `Lượt xem ${data.period_days} ngày`, data.total_views],
    [Users, "Khách duy nhất", data.unique_visitors],
    [MousePointerClick, "Phiên truy cập", data.sessions],
    [CalendarDays, "Lượt xem hôm nay", data.today_views],
  ] as const;

  if (compact) {
    return <section className="mt-7" aria-labelledby="analytics-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-black tracking-[.18em] text-brand-700">FIRST-PARTY ANALYTICS</p><h2 id="analytics-heading" className="mt-1 text-xl font-black">Lưu lượng website</h2></div>
        <Link href="/admin/analytics" className="text-sm font-bold text-brand-700">Xem phân tích chi tiết →</Link>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(([Icon, label, value]) => <article key={label} className="card p-5"><Icon className="text-brand-700" size={20}/><p className="mt-4 text-3xl font-black">{number.format(value)}</p><p className="mt-1 text-sm text-black/50">{label}</p></article>)}
      </div>
      <p className="mt-3 text-xs text-black/45">Chỉ ghi nhận khi khách xem trang đủ 5 giây; cùng một trang chỉ được tính một lần mỗi phiên 30 phút.</p>
    </section>;
  }

  return <section className="mt-7" aria-labelledby="analytics-heading">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><p className="text-xs font-black tracking-[.18em] text-brand-700">FIRST-PARTY ANALYTICS</p><h2 id="analytics-heading" className="mt-1 text-xl font-black">Lưu lượng website</h2><p className="mt-1 text-sm text-black/50">Thống kê ẩn danh, không lưu IP hoặc nội dung tìm kiếm.</p></div>
      <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-black ${change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
        {change >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}{change >= 0 ? "+" : ""}{change}% so với kỳ trước
      </div>
    </div>

    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map(([Icon, label, value]) => <article key={label} className="card p-5">
        <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-brand-500/15 text-brand-700"><Icon size={19}/></span><Activity size={17} className="text-black/35"/></div>
        <p className="mt-4 text-3xl font-black">{number.format(value)}</p><p className="mt-1 text-sm text-black/50">{label}</p>
      </article>)}
    </div>

    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,.8fr)]">
      <article className="card overflow-hidden p-5">
        <div className="flex items-center justify-between gap-3"><div><h3 className="font-black">Xu hướng theo ngày</h3><p className="mt-1 text-xs text-black/50">Lượt xem và khách duy nhất</p></div><p className="text-right text-xs text-black/50"><b className="text-base text-ink">{data.pages_per_session}</b><br/>trang / phiên</p></div>
        <div className="mt-6 overflow-x-auto pb-2">
          <div className="flex h-52 min-w-[680px] items-end gap-2 border-b border-white/10">
            {data.daily.map((day, index) => <div key={day.date} className="group flex h-full min-w-0 flex-1 flex-col justify-end">
              <div className="relative flex flex-1 items-end justify-center">
                <div className="absolute bottom-full z-10 mb-2 hidden whitespace-nowrap rounded-lg border border-white/10 bg-[#080c16] px-2 py-1 text-[11px] text-white shadow-xl group-hover:block">{number.format(day.views)} lượt xem · {number.format(day.visitors)} khách</div>
                <div className="w-full min-w-2 rounded-t-md bg-gradient-to-t from-brand-600 to-cyan-400 transition hover:brightness-125" style={{ height: `${Math.max(day.views ? 8 : 2, (day.views / maxDaily) * 100)}%`, opacity: day.views ? 1 : .18 }}/>
              </div>
              <span className="mt-2 h-4 text-center text-[9px] text-black/40">{index % 3 === 0 || index === data.daily.length - 1 ? shortDate.format(new Date(`${day.date}T00:00:00`)) : ""}</span>
            </div>)}
          </div>
        </div>
      </article>

      <article className="card p-5"><h3 className="font-black">Trang được xem nhiều</h3><p className="mt-1 text-xs text-black/50">Trong {data.period_days} ngày gần nhất</p><div className="mt-5 space-y-4">
        {data.top_pages.map((page) => <div key={page.path}><div className="flex items-center justify-between gap-3 text-sm"><Link href={page.path} target="_blank" className="min-w-0 truncate font-bold hover:text-brand-700">{page.path}</Link><b>{number.format(page.views)}</b></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-400" style={{ width: `${(page.views / maxPage) * 100}%` }}/></div></div>)}
        {data.top_pages.length === 0 && <p className="py-10 text-center text-sm text-black/50">Chưa có lượt truy cập. Dữ liệu sẽ xuất hiện sau khi khách mở website.</p>}
      </div></article>
    </div>

    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <article className="card p-5"><h3 className="font-black">Nguồn truy cập</h3><div className="mt-4 space-y-3">{data.referrers.map((source) => <div key={source.source} className="flex items-center gap-3"><span className="min-w-0 flex-1 truncate text-sm font-semibold">{source.source}</span><span className="text-sm text-black/50">{percentage(source.views, data.total_views)}%</span><b className="w-10 text-right text-sm">{number.format(source.views)}</b></div>)}{data.referrers.length === 0 && <p className="py-5 text-sm text-black/50">Chưa có dữ liệu nguồn truy cập.</p>}</div></article>
      <article className="card p-5"><h3 className="font-black">Thiết bị</h3><div className="mt-4 grid grid-cols-3 gap-3">{(["desktop", "mobile", "tablet"] as const).map((device) => {const current=data.devices.find((item)=>item.device===device);const Icon=device==="desktop"?Monitor:device==="mobile"?Smartphone:Tablet;const label=device==="desktop"?"Máy tính":device==="mobile"?"Điện thoại":"Máy tính bảng";return <div key={device} className="rounded-xl bg-white/5 p-4 text-center"><Icon className="mx-auto text-brand-700" size={21}/><p className="mt-3 text-xl font-black">{percentage(current?.views ?? 0,data.total_views)}%</p><p className="mt-1 truncate text-[11px] text-black/50">{label}</p></div>})}</div></article>
    </div>
  </section>;
}

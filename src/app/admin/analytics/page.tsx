import Link from "next/link";
import { Activity, ShieldCheck } from "lucide-react";
import { AnalyticsEngagementPanel, type EngagementAnalytics } from "@/components/admin/analytics-engagement-panel";
import { AnalyticsLocationPanel, type LocationAnalytics } from "@/components/admin/analytics-location-panel";
import { AnalyticsPanel, type AnalyticsOverview } from "@/components/admin/analytics-panel";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type DailyAnalytics = {
  date: string;
  views: number;
  visitors: number;
  sessions: number;
  desktop: number;
  mobile: number;
  tablet: number;
  direct_views: number;
  referred_views: number;
  top_page: string;
};

const periodOptions = [7, 30, 90] as const;
const number = new Intl.NumberFormat("vi-VN");
const fullDate = new Intl.DateTimeFormat("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const requestedDays = Number((await searchParams).days ?? 30);
  const days = periodOptions.includes(requestedDays as (typeof periodOptions)[number]) ? requestedDays : 30;
  let overview: AnalyticsOverview | null = null;
  let daily: DailyAnalytics[] = [];
  let dailyReportAvailable = true;
  let locations: LocationAnalytics | null = null;
  let engagement: EngagementAnalytics | null = null;

  if (isSupabaseConfigured()) {
    const db = await createClient();
    const [overviewResult, dailyResult, locationResult, engagementResult] = await Promise.all([
      db.rpc("get_analytics_overview", { p_days: days }),
      db.rpc("get_analytics_daily", { p_days: days }),
      db.rpc("get_analytics_locations", { p_days: days }),
      db.rpc("get_article_engagement", { p_days: days }),
    ]);
    overview = overviewResult.data as AnalyticsOverview | null;
    daily = Array.isArray(dailyResult.data) ? dailyResult.data as DailyAnalytics[] : [];
    dailyReportAvailable = !dailyResult.error;
    locations = locationResult.error ? null : locationResult.data as LocationAnalytics | null;
    engagement = engagementResult.error ? null : engagementResult.data as EngagementAnalytics | null;
  }

  return <>
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm font-bold text-brand-700">FIRST-PARTY ANALYTICS</p><h1 className="mt-1 text-3xl font-black">Phân tích truy cập</h1><p className="mt-2 text-black/50">Lượt xem hợp lệ sau 5 giây, báo cáo theo múi giờ Việt Nam.</p></div>
      <div className="flex rounded-xl border border-white/10 bg-white/5 p-1" aria-label="Khoảng thời gian báo cáo">
        {periodOptions.map((period) => <Link key={period} href={`/admin/analytics?days=${period}`} aria-current={days === period ? "page" : undefined} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${days === period ? "bg-brand-500 text-white" : "text-black/50 hover:text-ink"}`}>{period} ngày</Link>)}
      </div>
    </header>

    <div className="mt-5 flex gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[.07] p-4 text-sm leading-6"><ShieldCheck className="mt-0.5 shrink-0 text-emerald-400" size={20}/><p><b>Đang lọc lượt truy cập rác:</b> chỉ nhận request cùng website, giới hạn 15 request/phút, không đếm lại cùng trang trong một phiên 30 phút và có hạn mức bổ sung tại database. <b>Thiết bị đang đăng nhập Admin được loại trừ khỏi cả trang quản trị và website công khai.</b></p></div>

    <AnalyticsPanel data={overview}/>

    <AnalyticsEngagementPanel data={engagement} days={days}/>

    <section className="card mt-6 overflow-hidden" aria-labelledby="daily-detail-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5"><div><h2 id="daily-detail-heading" className="flex items-center gap-2 font-black"><Activity className="text-brand-700" size={20}/> Chi tiết từng ngày</h2><p className="mt-1 text-xs text-black/50">Khách, phiên, nguồn và thiết bị trong {days} ngày gần nhất</p></div><span className="text-xs font-semibold text-black/40">Asia/Ho_Chi_Minh</span></div>
      {!dailyReportAvailable ? <div className="p-8 text-center"><p className="font-bold">Chưa có báo cáo chi tiết theo ngày.</p><p className="mt-2 text-sm text-black/50">Hãy chạy migration 016_fix_daily_analytics_report.sql trên Supabase.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-white/[.03] text-xs uppercase tracking-wide text-black/45"><tr><th className="p-4">Ngày</th><th className="p-4 text-right">Lượt xem</th><th className="p-4 text-right">Khách</th><th className="p-4 text-right">Phiên</th><th className="p-4 text-right">Trang/phiên</th><th className="p-4">Nguồn</th><th className="p-4">Thiết bị</th><th className="p-4">Trang nổi bật</th></tr></thead><tbody>{daily.map((row) => <tr key={row.date} className="border-t border-white/10 align-top hover:bg-white/[.025]"><td className="whitespace-nowrap p-4 font-bold">{fullDate.format(new Date(`${row.date}T00:00:00+07:00`))}</td><td className="p-4 text-right font-black">{number.format(row.views)}</td><td className="p-4 text-right">{number.format(row.visitors)}</td><td className="p-4 text-right">{number.format(row.sessions)}</td><td className="p-4 text-right">{row.sessions ? (row.views / row.sessions).toFixed(2) : "0"}</td><td className="p-4 text-xs leading-5"><span className="block">Trực tiếp: <b>{number.format(row.direct_views)}</b></span><span className="block text-black/45">Giới thiệu: {number.format(row.referred_views)}</span></td><td className="p-4 text-xs leading-5"><span className="block">Desktop: <b>{number.format(row.desktop)}</b></span><span className="block text-black/45">Mobile: {number.format(row.mobile)} · Tablet: {number.format(row.tablet)}</span></td><td className="max-w-64 p-4">{row.top_page.startsWith("/") ? <Link href={row.top_page} target="_blank" className="block truncate font-semibold text-brand-700 hover:underline">{row.top_page}</Link> : <span className="text-black/40">—</span>}</td></tr>)}{daily.length === 0 && <tr><td colSpan={8} className="p-10 text-center text-black/50">Chưa có dữ liệu trong khoảng thời gian này.</td></tr>}</tbody></table></div>}
    </section>

    <AnalyticsLocationPanel data={locations} days={days}/>
  </>;
}

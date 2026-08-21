import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AnalyticsDailyTable, type DailyAnalytics } from "@/components/admin/analytics-daily-table";
import { AnalyticsEngagementPanel, type EngagementAnalytics } from "@/components/admin/analytics-engagement-panel";
import { AnalyticsLocationPanel, type LocationAnalytics } from "@/components/admin/analytics-location-panel";
import { AnalyticsPanel, type AnalyticsOverview } from "@/components/admin/analytics-panel";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";


const periodOptions = [7, 30, 90] as const;

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

    <AnalyticsDailyTable rows={daily} available={dailyReportAvailable} days={days}/>

    <AnalyticsLocationPanel data={locations} days={days}/>
  </>;
}

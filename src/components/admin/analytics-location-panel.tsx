import { Globe2, MapPinned } from "lucide-react";
import { VIETNAM_PROVINCES } from "@/lib/vietnam-regions";

export type LocationAnalytics = {
  period_days: number;
  provinces: { location: string; country_code: string | null; views: number; visitors: number; sessions: number }[];
  daily: { date: string; location: string; views: number; visitors: number }[];
};

const number = new Intl.NumberFormat("vi-VN");
const fullDate = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export function AnalyticsLocationPanel({ data, days }: { data: LocationAnalytics | null; days: number }) {
  if (!data) {
    return <section className="card mt-6 p-8 text-center"><MapPinned className="mx-auto text-black/35"/><h2 className="mt-3 font-black">Chưa có báo cáo tỉnh/thành</h2><p className="mt-2 text-sm text-black/50">Chạy migration 017_location_analytics.sql trên Supabase rồi tải lại trang.</p></section>;
  }

  const provinceStats = new Map(data.provinces.map((item) => [item.location, item]));
  const covered = VIETNAM_PROVINCES.filter((province) => (provinceStats.get(province)?.views ?? 0) > 0).length;
  const ranked = data.provinces.filter((item) => item.views > 0).slice().sort((a, b) => b.views - a.views);
  const maxViews = Math.max(1, ...ranked.map((item) => item.views));
  const dailyRows = data.daily.slice(0, 150);

  return <section className="mt-6" aria-labelledby="location-analytics-heading">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black tracking-[.18em] text-brand-700">VỊ TRÍ ƯỚC TÍNH</p><h2 id="location-analytics-heading" className="mt-1 flex items-center gap-2 text-xl font-black"><MapPinned size={21}/> Vùng truy cập</h2><p className="mt-1 text-sm text-black/50">Tỉnh/thành được suy ra từ IP bởi Vercel; không lưu địa chỉ IP hoặc tọa độ.</p></div><span className="rounded-full bg-brand-500/10 px-3 py-1.5 text-xs font-black text-brand-700">{covered}/34 tỉnh thành có truy cập</span></div>

    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(280px,.8fr)_minmax(0,1.5fr)]">
      <article className="card p-5"><h3 className="flex items-center gap-2 font-black"><Globe2 className="text-brand-700" size={19}/> Khu vực nổi bật</h3><p className="mt-1 text-xs text-black/50">Trong {days} ngày gần nhất</p><div className="mt-5 space-y-4">{ranked.slice(0, 10).map((item) => <div key={item.location}><div className="flex items-center justify-between gap-3 text-sm"><span className="min-w-0 truncate font-bold">{item.location}</span><span className="shrink-0"><b>{number.format(item.views)}</b> <span className="text-black/40">lượt</span></span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-400" style={{ width: `${(item.views / maxViews) * 100}%` }}/></div><p className="mt-1 text-[11px] text-black/40">{number.format(item.visitors)} khách · {number.format(item.sessions)} phiên</p></div>)}{ranked.length === 0 && <p className="py-8 text-center text-sm text-black/50">Dữ liệu vùng sẽ xuất hiện với các lượt xem mới.</p>}</div></article>

      <article className="card p-5"><h3 className="font-black">Toàn bộ 34 tỉnh/thành</h3><p className="mt-1 text-xs text-black/50">Các tỉnh chưa có dữ liệu được hiển thị bằng 0</p><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{VIETNAM_PROVINCES.map((province) => {const current=provinceStats.get(province);return <div key={province} className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm ${current?.views ? "border-brand-500/25 bg-brand-500/[.07]" : "border-white/10 bg-white/[.025] text-black/40"}`}><span className="truncate font-semibold">{province}</span><b>{number.format(current?.views ?? 0)}</b></div>})}</div></article>
    </div>

    <article className="card mt-4 overflow-hidden"><div className="border-b border-white/10 p-5"><h3 className="font-black">Tỉnh/thành theo từng ngày</h3><p className="mt-1 text-xs text-black/50">Tối đa 150 dòng gần nhất · múi giờ Việt Nam</p></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-white/[.03] text-xs uppercase tracking-wide text-black/45"><tr><th className="p-4">Ngày</th><th className="p-4">Tỉnh/thành</th><th className="p-4 text-right">Lượt xem</th><th className="p-4 text-right">Khách</th></tr></thead><tbody>{dailyRows.map((row) => <tr key={`${row.date}-${row.location}`} className="border-t border-white/10"><td className="whitespace-nowrap p-4 font-semibold">{fullDate.format(new Date(`${row.date}T00:00:00+07:00`))}</td><td className="p-4 font-bold">{row.location}</td><td className="p-4 text-right font-black">{number.format(row.views)}</td><td className="p-4 text-right">{number.format(row.visitors)}</td></tr>)}{dailyRows.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-black/50">Chưa có dữ liệu vị trí cho các lượt truy cập mới.</td></tr>}</tbody></table></div></article>
  </section>;
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Activity } from "lucide-react";
import { getPageSlice, TablePagination } from "@/components/admin/table-pagination";

export type DailyAnalytics = {
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

const number = new Intl.NumberFormat("vi-VN");
const fullDate = new Intl.DateTimeFormat("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });

export function AnalyticsDailyTable({ rows, available, days }: { rows: DailyAnalytics[]; available: boolean; days: number }) {
  const [page, setPage] = useState(1);
  const current = getPageSlice(rows, page);

  return <section className="card mt-6 overflow-hidden" aria-labelledby="daily-detail-heading">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5"><div><h2 id="daily-detail-heading" className="flex items-center gap-2 font-black"><Activity className="text-brand-700" size={20}/> Chi tiết từng ngày</h2><p className="mt-1 text-xs text-black/50">Khách, phiên, nguồn và thiết bị trong {days} ngày gần nhất</p></div><span className="text-xs font-semibold text-black/40">Asia/Ho_Chi_Minh</span></div>
    {!available ? <div className="p-8 text-center"><p className="font-bold">Chưa có báo cáo chi tiết theo ngày.</p><p className="mt-2 text-sm text-black/50">Hãy chạy migration 016_fix_daily_analytics_report.sql trên Supabase.</p></div> : <><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-white/[.03] text-xs uppercase tracking-wide text-black/45"><tr><th className="p-4">Ngày</th><th className="p-4 text-right">Lượt xem</th><th className="p-4 text-right">Khách</th><th className="p-4 text-right">Phiên</th><th className="p-4 text-right">Trang/phiên</th><th className="p-4">Nguồn</th><th className="p-4">Thiết bị</th><th className="p-4">Trang nổi bật</th></tr></thead><tbody>{current.rows.map((row) => <tr key={row.date} className="border-t border-white/10 align-top hover:bg-white/[.025]"><td className="whitespace-nowrap p-4 font-bold">{fullDate.format(new Date(`${row.date}T00:00:00+07:00`))}</td><td className="p-4 text-right font-black">{number.format(row.views)}</td><td className="p-4 text-right">{number.format(row.visitors)}</td><td className="p-4 text-right">{number.format(row.sessions)}</td><td className="p-4 text-right">{row.sessions ? (row.views / row.sessions).toFixed(2) : "0"}</td><td className="p-4 text-xs leading-5"><span className="block">Trực tiếp: <b>{number.format(row.direct_views)}</b></span><span className="block text-black/45">Giới thiệu: {number.format(row.referred_views)}</span></td><td className="p-4 text-xs leading-5"><span className="block">Desktop: <b>{number.format(row.desktop)}</b></span><span className="block text-black/45">Mobile: {number.format(row.mobile)} · Tablet: {number.format(row.tablet)}</span></td><td className="max-w-64 p-4">{row.top_page.startsWith("/") ? <Link href={row.top_page} target="_blank" className="block truncate font-semibold text-brand-700 hover:underline">{row.top_page}</Link> : <span className="text-black/40">—</span>}</td></tr>)}{rows.length === 0 && <tr><td colSpan={8} className="p-10 text-center text-black/50">Chưa có dữ liệu trong khoảng thời gian này.</td></tr>}</tbody></table></div><TablePagination page={current.currentPage} totalItems={rows.length} onPageChange={setPage}/></>}
  </section>;
}

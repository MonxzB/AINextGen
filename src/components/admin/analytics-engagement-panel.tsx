"use client";

import Link from "next/link";
import { Activity, BookOpenCheck, Clock3, Gauge } from "lucide-react";
import { useEffect, useState } from "react";

import { getPageSlice, TablePagination } from "@/components/admin/table-pagination";
type ArticleEngagementRow = {
  path: string;
  title: string;
  slug: string | null;
  views: number;
  avg_active_seconds: number;
  avg_scroll_percent: number;
  retention_25: number;
  retention_50: number;
  retention_75: number;
  retention_90: number;
  engaged_rate: number;
  completion_rate: number;
};

export type EngagementAnalytics = {
  period_days: number;
  summary: {
    article_views: number;
    avg_active_seconds: number;
    avg_scroll_percent: number;
    engaged_rate: number;
    completion_rate: number;
  };
  articles: ArticleEngagementRow[];
  daily: {
    date: string;
    views: number;
    avg_active_seconds: number;
    avg_scroll_percent: number;
    completion_rate: number;
  }[];
};

const number = new Intl.NumberFormat("vi-VN");
const shortDate = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" });

function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes ? `${minutes}m ${String(rest).padStart(2, "0")}s` : `${rest}s`;
}

function PercentBar({ value }: { value: number }) {
  const percent = Math.max(0, Math.min(100, Number(value) || 0));
  return <div className="min-w-20"><b>{percent.toFixed(1)}%</b><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-400" style={{ width: `${percent}%` }}/></div></div>;
}

export function AnalyticsEngagementPanel({ data, days }: { data: EngagementAnalytics | null; days: number }) {
  const [articlePage, setArticlePage] = useState(1);
  const [dailyPage, setDailyPage] = useState(1);
  const articlePagination = getPageSlice(data?.articles ?? [], articlePage);
  const dailyPagination = getPageSlice(data?.daily ?? [], dailyPage);
  useEffect(() => {
    setArticlePage(1);
    setDailyPage(1);
  }, [days]);
  if (!data) {
    return <section className="card mt-6 p-8 text-center"><Gauge className="mx-auto text-black/35"/><h2 className="mt-3 font-black">Chưa có báo cáo giữ chân bài viết</h2><p className="mt-2 text-sm text-black/50">Chạy migration 018_article_engagement_analytics.sql trên Supabase rồi redeploy website.</p></section>;
  }

  const cards = [
    { label: "Lượt đọc được đo", value: number.format(data.summary.article_views), note: "Chỉ dữ liệu sau khi bật tính năng", icon: BookOpenCheck },
    { label: "Thời gian xem TB", value: formatDuration(data.summary.avg_active_seconds), note: "Không cộng tab ẩn hoặc idle >60 giây", icon: Clock3 },
    { label: "Độ sâu cuộn TB", value: `${data.summary.avg_scroll_percent.toFixed(1)}%`, note: "Chỉ tính phần nội dung chính", icon: Gauge },
    { label: "Tỷ lệ tương tác", value: `${data.summary.engaged_rate.toFixed(1)}%`, note: "≥30 giây hoặc cuộn ≥50%", icon: Activity },
    { label: "Tỷ lệ đọc xong", value: `${data.summary.completion_rate.toFixed(1)}%`, note: "Cuộn ≥90% hoặc đủ thời gian", icon: BookOpenCheck },
  ];

  return <section className="mt-6" aria-labelledby="engagement-heading">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black tracking-[.18em] text-brand-700">ARTICLE ENGAGEMENT</p><h2 id="engagement-heading" className="mt-1 flex items-center gap-2 text-xl font-black"><Gauge size={21}/> Chất lượng & giữ chân bài viết</h2><p className="mt-1 text-sm text-black/50">Đo thời gian đọc chủ động, độ sâu cuộn và điểm rời khỏi bài trong {days} ngày gần nhất.</p></div><span className="rounded-full bg-brand-500/10 px-3 py-1.5 text-xs font-black text-brand-700">Idle cutoff: 60 giây</span></div>

    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map((card) => {const Icon=card.icon;return <article key={card.label} className="card p-5"><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-wide text-black/45">{card.label}</p><Icon className="text-brand-700" size={18}/></div><p className="mt-3 text-2xl font-black">{card.value}</p><p className="mt-2 text-xs leading-5 text-black/45">{card.note}</p></article>})}</div>

    <article className="card mt-4 overflow-hidden"><div className="border-b border-white/10 p-5"><h3 className="font-black">Giữ chân theo từng bài viết</h3><p className="mt-1 text-xs text-black/50">Retention = tỷ lệ lượt đọc đã đi qua 25%, 50%, 75% và 90% phần nội dung bài.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[1280px] text-left text-sm"><thead className="bg-white/[.03] text-xs uppercase tracking-wide text-black/45"><tr><th className="p-4">Bài viết</th><th className="p-4 text-right">Lượt đọc</th><th className="p-4 text-right">Xem TB</th><th className="p-4 text-right">Cuộn TB</th><th className="p-4">Qua 25%</th><th className="p-4">Qua 50%</th><th className="p-4">Qua 75%</th><th className="p-4">Qua 90%</th><th className="p-4">Đọc xong</th></tr></thead><tbody>{articlePagination.rows.map((row) => <tr key={row.path} className="border-t border-white/10 align-top hover:bg-white/[.025]"><td className="max-w-80 p-4"><Link href={row.path} target="_blank" className="line-clamp-2 font-bold text-brand-700 hover:underline">{row.title}</Link><span className="mt-1 block truncate text-xs text-black/35">{row.path}</span></td><td className="p-4 text-right font-black">{number.format(row.views)}</td><td className="whitespace-nowrap p-4 text-right">{formatDuration(row.avg_active_seconds)}</td><td className="p-4 text-right">{row.avg_scroll_percent.toFixed(1)}%</td><td className="p-4"><PercentBar value={row.retention_25}/></td><td className="p-4"><PercentBar value={row.retention_50}/></td><td className="p-4"><PercentBar value={row.retention_75}/></td><td className="p-4"><PercentBar value={row.retention_90}/></td><td className="p-4"><PercentBar value={row.completion_rate}/></td></tr>)}{data.articles.length === 0 && <tr><td colSpan={9} className="p-10 text-center text-black/50">Chưa có lượt đọc mới sau khi bật đo engagement.</td></tr>}</tbody></table></div><TablePagination page={articlePagination.currentPage} totalItems={data.articles.length} onPageChange={setArticlePage}/></article>

    <article className="card mt-4 overflow-hidden"><div className="border-b border-white/10 p-5"><h3 className="font-black">Xu hướng engagement theo ngày</h3><p className="mt-1 text-xs text-black/50">10 dòng mỗi trang · Asia/Ho_Chi_Minh</p></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-white/[.03] text-xs uppercase tracking-wide text-black/45"><tr><th className="p-4">Ngày</th><th className="p-4 text-right">Lượt đọc</th><th className="p-4 text-right">Thời gian TB</th><th className="p-4 text-right">Cuộn TB</th><th className="p-4">Đọc xong</th></tr></thead><tbody>{dailyPagination.rows.map((row) => <tr key={row.date} className="border-t border-white/10"><td className="p-4 font-bold">{shortDate.format(new Date(`${row.date}T00:00:00+07:00`))}</td><td className="p-4 text-right font-black">{number.format(row.views)}</td><td className="p-4 text-right">{row.views ? formatDuration(row.avg_active_seconds) : "—"}</td><td className="p-4 text-right">{row.views ? `${row.avg_scroll_percent.toFixed(1)}%` : "—"}</td><td className="p-4">{row.views ? <PercentBar value={row.completion_rate}/> : <span className="text-black/35">—</span>}</td></tr>)}</tbody></table></div><TablePagination page={dailyPagination.currentPage} totalItems={data.daily.length} onPageChange={setDailyPage}/></article>
  </section>;
}

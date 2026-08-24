import Link from "next/link";
import { BarChart3, BellRing, Check, CheckCheck, Mail, MailWarning } from "lucide-react";
import { markAllNotificationsRead, markNotificationRead, openNotification } from "@/app/admin/notifications/actions";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type NotificationRow = {
  id: string;
  kind: string;
  title: string;
  message: string;
  action_url: string;
  metadata: { new_views?: number; total_views?: number; visitors?: number; sessions?: number } | null;
  is_read: boolean;
  read_at: string | null;
  email_status: string;
  created_at: string;
};

const PAGE_SIZE = 10;
const date = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Ho_Chi_Minh",
});

function pageHref(page: number) {
  return page <= 1 ? "/admin/notifications" : `/admin/notifications?page=${page}`;
}

export default async function AdminNotificationsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const requestedPage = Math.max(1, Number.parseInt((await searchParams).page ?? "1", 10) || 1);
  let rows: NotificationRow[] = [];
  let total = 0;
  let available = isSupabaseConfigured();

  if (available) {
    const db = await createClient();
    const from = (requestedPage - 1) * PAGE_SIZE;
    const result = await db.from("notifications")
      .select("id,kind,title,message,action_url,metadata,is_read,read_at,email_status,created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    available = !result.error;
    rows = (result.data ?? []) as NotificationRow[];
    total = result.count ?? 0;
  }

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, pageCount);
  const unreadOnPage = rows.filter((item) => !item.is_read).length;

  return <>
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-brand-700">ADMIN NOTIFICATIONS</p><h1 className="mt-1 flex items-center gap-2 text-3xl font-black"><BellRing size={29}/> Thông báo</h1><p className="mt-2 text-black/50">Theo dõi các mốc lưu lượng quan trọng ngay trên điện thoại.</p></div>{unreadOnPage > 0 && <form action={markAllNotificationsRead}><button className="btn-secondary gap-2"><CheckCheck size={17}/> Đánh dấu tất cả đã đọc</button></form>}</header>

    {!available ? <section className="card mt-6 p-8 text-center"><BellRing className="mx-auto text-black/35"/><h2 className="mt-3 font-black">Chưa bật hệ thống notification</h2><p className="mt-2 text-sm text-black/50">Chạy migration 019_traffic_notifications.sql trên Supabase rồi redeploy website.</p></section> : <section className="card mt-6 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 p-5"><div><h2 className="font-black">Mới nhất</h2><p className="mt-1 text-xs text-black/45">10 thông báo mỗi trang · tổng cộng {total}</p></div><span className="rounded-full bg-brand-500/10 px-3 py-1.5 text-xs font-black text-brand-700">Mỗi 20 lượt hợp lệ</span></div>
      <div>{rows.map((item) => {const metadata=item.metadata??{};const emailReady=item.email_status==="sent";return <article key={item.id} className={`border-b border-white/10 p-5 last:border-0 ${item.is_read ? "opacity-70" : "bg-brand-500/[.045]"}`}><div className="flex items-start gap-4"><span className={`mt-0.5 grid size-11 shrink-0 place-items-center rounded-2xl ${item.is_read ? "bg-white/5 text-black/40" : "bg-brand-500/15 text-brand-700"}`}><BarChart3 size={21}/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-black">{item.title}</h3><p className="mt-1 text-sm leading-6 text-black/55">{item.message}</p></div>{!item.is_read&&<span className="rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-black text-red-500">CHƯA ĐỌC</span>}</div><div className="mt-3 flex flex-wrap gap-2 text-xs"><span className="rounded-lg bg-white/5 px-2.5 py-1.5"><b>{metadata.new_views??0}</b> lượt mới</span><span className="rounded-lg bg-white/5 px-2.5 py-1.5"><b>{metadata.visitors??0}</b> khách</span><span className="rounded-lg bg-white/5 px-2.5 py-1.5"><b>{metadata.sessions??0}</b> phiên</span><span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 ${emailReady ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>{emailReady?<Mail size={13}/>:<MailWarning size={13}/>} {emailReady?"Đã gửi email":"Email chờ cấu hình"}</span></div><div className="mt-4 flex flex-wrap items-center gap-2"><form action={openNotification.bind(null,item.id,item.action_url)}><button className="btn-primary px-3 py-2 text-xs"><BarChart3 size={15}/> Xem phân tích</button></form>{!item.is_read&&<form action={markNotificationRead.bind(null,item.id)}><button className="btn-secondary px-3 py-2 text-xs"><Check size={15}/> Đã đọc</button></form>}<time className="ml-auto text-xs text-black/35" dateTime={item.created_at}>{date.format(new Date(item.created_at))}</time></div></div></div></article>})}{rows.length===0&&<div className="p-12 text-center"><BellRing className="mx-auto text-black/30"/><p className="mt-3 font-black">Chưa có thông báo</p><p className="mt-2 text-sm text-black/45">Thông báo đầu tiên sẽ xuất hiện sau 20 lượt xem hợp lệ mới.</p></div>}</div>
      {total > PAGE_SIZE && <nav className="flex items-center justify-between gap-3 border-t border-white/10 p-4 text-sm" aria-label="Phân trang thông báo"><Link href={pageHref(currentPage-1)} aria-disabled={currentPage===1} className={`btn-secondary px-3 py-2 text-xs ${currentPage===1?"pointer-events-none opacity-35":""}`}>← Trang trước</Link><span className="text-xs font-semibold">Trang {currentPage} / {pageCount}</span><Link href={pageHref(currentPage+1)} aria-disabled={currentPage===pageCount} className={`btn-secondary px-3 py-2 text-xs ${currentPage===pageCount?"pointer-events-none opacity-35":""}`}>Trang sau →</Link></nav>}
    </section>}
  </>;
}

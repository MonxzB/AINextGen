"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Bell } from "lucide-react";

export function AdminNotificationBell() {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/notifications/unread-count", { cache: "no-store" });
      if (!response.ok) return;
      const payload = await response.json() as { count?: number };
      setCount(Math.max(0, Number(payload.count) || 0));
    } catch {
      // The bell is a convenience; notification failures must not break Admin.
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(refresh, 60_000);
    const onVisibility = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh]);

  return <Link href="/admin/notifications" className="relative grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-black/60 transition hover:border-brand-500/30 hover:text-brand-700" aria-label={count ? `${count} thông báo chưa đọc` : "Thông báo"}>
    <Bell size={19}/>
    {count > 0 && <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-black leading-5 text-white">{count > 99 ? "99+" : count}</span>}
  </Link>;
}

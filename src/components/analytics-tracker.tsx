"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || navigator.doNotTrack === "1") return;
    if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/login") return;

    const now = Date.now();
    const storageKey = `ainext-view:${pathname}`;
    const lastTracked = Number(sessionStorage.getItem(storageKey) ?? 0);
    if (now - lastTracked < 2_000) return;

    const timer = window.setTimeout(() => {
      // Mark the view only when the request is actually dispatched. In React
      // Strict Mode the first effect can be cleaned up before this timer fires.
      sessionStorage.setItem(storageKey, String(Date.now()));
      void fetch("/api/analytics/page-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname, referrer: document.referrer }),
        keepalive: true,
      }).catch(() => undefined);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}

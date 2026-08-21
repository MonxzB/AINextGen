"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REQUIRED_ACTIVE_TIME_MS = 5_000;
const SAME_PAGE_COOLDOWN_MS = 30 * 60 * 1_000;

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || navigator.doNotTrack === "1") return;
    if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/login") return;

    const storageKey = `ainext-view:${pathname}`;
    const lastTracked = Number(sessionStorage.getItem(storageKey) ?? 0);
    if (Date.now() - lastTracked < SAME_PAGE_COOLDOWN_MS) return;

    let activeTime = 0;
    let visibleSince = document.visibilityState === "visible" ? performance.now() : null;
    let timer: number | undefined;
    let dispatched = false;

    const clearTimer = () => {
      if (timer) window.clearTimeout(timer);
      timer = undefined;
    };

    const dispatch = () => {
      if (dispatched || document.visibilityState !== "visible" || visibleSince === null) return;
      activeTime += performance.now() - visibleSince;
      visibleSince = performance.now();
      if (activeTime < REQUIRED_ACTIVE_TIME_MS) {
        timer = window.setTimeout(dispatch, REQUIRED_ACTIVE_TIME_MS - activeTime);
        return;
      }

      dispatched = true;
      sessionStorage.setItem(storageKey, String(Date.now()));
      void fetch("/api/analytics/page-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname, referrer: document.referrer, engaged_ms: Math.round(activeTime) }),
        keepalive: true,
      }).then((response) => {
        if (!response.ok) sessionStorage.removeItem(storageKey);
      }).catch(() => sessionStorage.removeItem(storageKey));
    };

    const schedule = () => {
      clearTimer();
      if (document.visibilityState === "visible" && visibleSince !== null && !dispatched) {
        timer = window.setTimeout(dispatch, Math.max(0, REQUIRED_ACTIVE_TIME_MS - activeTime));
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (visibleSince !== null) activeTime += performance.now() - visibleSince;
        visibleSince = null;
        clearTimer();
      } else {
        visibleSince = performance.now();
        schedule();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    schedule();
    return () => {
      clearTimer();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pathname]);

  return null;
}

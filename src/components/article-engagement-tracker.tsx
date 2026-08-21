"use client";

import { useEffect } from "react";

const HEARTBEAT_MS = 15_000;
const IDLE_AFTER_MS = 60_000;
const MINIMUM_ACTIVE_MS = 5_000;
const OPT_OUT_COOKIE = "ainext_analytics_opt_out=1";

export function ArticleEngagementTracker({
  path,
  estimatedReadSeconds,
}: {
  path: string;
  estimatedReadSeconds: number;
}) {
  useEffect(() => {
    if (navigator.doNotTrack === "1") return;
    if (document.cookie.split(";").some((cookie) => cookie.trim() === OPT_OUT_COOKIE)) return;

    const article = document.getElementById("tutorial-content");
    if (!article) return;

    let activeMs = 0;
    let maxScrollPercent = 0;
    let lastTick = performance.now();
    let lastActivity = Date.now();
    let lastSentActiveMs = 0;
    let lastSentScroll = -1;

    const updateScrollDepth = () => {
      const articleTop = article.getBoundingClientRect().top + window.scrollY;
      const articleHeight = Math.max(article.offsetHeight, 1);
      const viewportBottom = window.scrollY + window.innerHeight;
      const progress = Math.round(((viewportBottom - articleTop) / articleHeight) * 100);
      maxScrollPercent = Math.max(maxScrollPercent, Math.min(100, Math.max(0, progress)));
    };

    const tick = () => {
      const now = performance.now();
      const elapsed = Math.min(now - lastTick, 2_000);
      if (document.visibilityState === "visible" && Date.now() - lastActivity <= IDLE_AFTER_MS) {
        activeMs += Math.max(0, elapsed);
      }
      lastTick = now;
    };

    const markActivity = () => {
      tick();
      lastActivity = Date.now();
      updateScrollDepth();
    };

    const send = () => {
      tick();
      updateScrollDepth();
      if (activeMs < MINIMUM_ACTIVE_MS) return;
      if (activeMs - lastSentActiveMs < 1_000 && maxScrollPercent === lastSentScroll) return;

      lastSentActiveMs = activeMs;
      lastSentScroll = maxScrollPercent;
      void fetch("/api/analytics/engagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path,
          active_ms: Math.round(activeMs),
          max_scroll_percent: maxScrollPercent,
          estimated_read_seconds: estimatedReadSeconds,
        }),
        keepalive: true,
      }).catch(() => undefined);
    };

    const onVisibilityChange = () => {
      tick();
      if (document.visibilityState === "hidden") send();
      lastTick = performance.now();
    };

    const tickTimer = window.setInterval(tick, 1_000);
    const heartbeatTimer = window.setInterval(send, HEARTBEAT_MS);
    updateScrollDepth();
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("scroll", markActivity, { passive: true });
    window.addEventListener("pointerdown", markActivity, { passive: true });
    window.addEventListener("touchstart", markActivity, { passive: true });
    window.addEventListener("keydown", markActivity);
    window.addEventListener("pagehide", send);

    return () => {
      send();
      window.clearInterval(tickTimer);
      window.clearInterval(heartbeatTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("scroll", markActivity);
      window.removeEventListener("pointerdown", markActivity);
      window.removeEventListener("touchstart", markActivity);
      window.removeEventListener("keydown", markActivity);
      window.removeEventListener("pagehide", send);
    };
  }, [estimatedReadSeconds, path]);

  return null;
}

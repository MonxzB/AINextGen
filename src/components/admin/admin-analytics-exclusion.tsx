"use client";

import { useEffect } from "react";

const OPT_OUT_COOKIE = "ainext_analytics_opt_out=1";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function AdminAnalyticsExclusion() {
  useEffect(() => {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${OPT_OUT_COOKIE}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax${secure}`;

    void fetch("/api/admin/analytics/exclude-device", {
      method: "POST",
      credentials: "same-origin",
    }).catch(() => undefined);
  }, []);

  return null;
}

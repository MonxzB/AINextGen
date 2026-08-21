"use client";

import { useEffect } from "react";

const SYNC_KEY = "ainext-admin-analytics-exclusion-v1";

export function AdminAnalyticsExclusion() {
  useEffect(() => {
    if (sessionStorage.getItem(SYNC_KEY)) return;
    sessionStorage.setItem(SYNC_KEY, "pending");

    void fetch("/api/admin/analytics/exclude-device", {
      method: "POST",
      credentials: "same-origin",
    }).then((response) => {
      if (response.ok) sessionStorage.setItem(SYNC_KEY, "synced");
      else sessionStorage.removeItem(SYNC_KEY);
    }).catch(() => sessionStorage.removeItem(SYNC_KEY));
  }, []);

  return null;
}

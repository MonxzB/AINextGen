import "server-only";

import { getAdminClient } from "@/lib/supabase/admin";

type TrafficMetadata = {
  new_views?: number;
  total_views?: number;
  visitors?: number;
  sessions?: number;
  top_pages?: { path: string; views: number }[];
};

type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  action_url: string;
  metadata: TrafficMetadata | null;
  email_status: string;
  email_attempts: number;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.NOTIFICATION_FROM_EMAIL?.trim();
  const recipients = process.env.ADMIN_NOTIFICATION_EMAIL?.split(",")
    .map((item) => item.trim()).filter(Boolean) ?? [];
  return apiKey && from && recipients.length ? { apiKey, from, recipients } : null;
}

function renderEmail(notification: NotificationRecord) {
  const metadata = notification.metadata ?? {};
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://ainextgen.io.vn").replace(/\/$/, "");
  const actionUrl = `${siteUrl}${notification.action_url}`;
  const topPages = Array.isArray(metadata.top_pages) ? metadata.top_pages.slice(0, 3) : [];
  const topPagesHtml = topPages.length
    ? `<h3 style="margin:24px 0 8px;font-size:16px">Trang nổi bật</h3><ol style="margin:0;padding-left:20px">${topPages.map((page) => `<li style="margin:8px 0"><strong>${escapeHtml(page.views)} lượt</strong> — ${escapeHtml(page.path)}</li>`).join("")}</ol>`
    : "";
  const html = `<!doctype html><html><body style="margin:0;background:#f5f7fb;font-family:Arial,sans-serif;color:#172033"><div style="max-width:600px;margin:0 auto;padding:28px 16px"><div style="background:#fff;border:1px solid #e8ebf2;border-radius:18px;padding:28px"><p style="margin:0 0 10px;color:#6957ff;font-size:12px;font-weight:700;letter-spacing:.12em">AINEXTGEN ANALYTICS</p><h1 style="margin:0;font-size:24px;line-height:1.3">${escapeHtml(notification.title)}</h1><p style="margin:14px 0 0;color:#5d6678;line-height:1.7">${escapeHtml(notification.message)}</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:22px"><div style="background:#f6f4ff;border-radius:12px;padding:14px"><small style="color:#737b8c">Lượt mới</small><div style="margin-top:5px;font-size:22px;font-weight:800">${escapeHtml(metadata.new_views ?? 0)}</div></div><div style="background:#f6f4ff;border-radius:12px;padding:14px"><small style="color:#737b8c">Khách</small><div style="margin-top:5px;font-size:22px;font-weight:800">${escapeHtml(metadata.visitors ?? 0)}</div></div><div style="background:#f6f4ff;border-radius:12px;padding:14px"><small style="color:#737b8c">Phiên</small><div style="margin-top:5px;font-size:22px;font-weight:800">${escapeHtml(metadata.sessions ?? 0)}</div></div></div>${topPagesHtml}<a href="${escapeHtml(actionUrl)}" style="display:inline-block;margin-top:26px;border-radius:12px;background:#6957ff;padding:13px 20px;color:#fff;text-decoration:none;font-weight:700">Mở phân tích truy cập</a><p style="margin:24px 0 0;color:#9aa1af;font-size:12px;line-height:1.6">Thông báo quản trị tự động từ ainextgen.io.vn. Không chứa IP hoặc định danh khách truy cập.</p></div></div></body></html>`;
  const text = `${notification.title}\n\n${notification.message}\n\n${topPages.map((page) => `${page.views} lượt — ${page.path}`).join("\n")}\n\nMở phân tích: ${actionUrl}`;
  return { html, text };
}

export async function deliverNotificationEmail(notificationId: string) {
  const db = getAdminClient();
  const { data } = await db.from("notifications")
    .select("id,title,message,action_url,metadata,email_status,email_attempts")
    .eq("id", notificationId)
    .maybeSingle();
  const notification = data as NotificationRecord | null;
  if (!notification || notification.email_status === "sent") return;

  const config = getEmailConfig();
  if (!config) {
    await db.from("notifications").update({
      email_status: "disabled",
      email_last_error: "Thiếu cấu hình Resend hoặc email Admin nhận thông báo.",
    }).eq("id", notificationId);
    return;
  }

  const attempt = Math.min(10, (notification.email_attempts ?? 0) + 1);
  const { data: claimed } = await db.from("notifications").update({
    email_status: "sending",
    email_attempts: attempt,
    email_last_error: null,
  }).eq("id", notificationId)
    .in("email_status", ["pending", "failed", "disabled"])
    .select("id")
    .maybeSingle();
  if (!claimed) return;

  try {
    const content = renderEmail(notification);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `ainext-notification-${notification.id}`,
      },
      body: JSON.stringify({
        from: config.from,
        to: config.recipients,
        subject: `[AINextGen] ${notification.title}`,
        html: content.html,
        text: content.text,
      }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Resend ${response.status}: ${(await response.text()).slice(0, 800)}`);

    await db.from("notifications").update({
      email_status: "sent",
      email_sent_at: new Date().toISOString(),
      email_last_error: null,
    }).eq("id", notificationId);
  } catch (error) {
    await db.from("notifications").update({
      email_status: "failed",
      email_last_error: error instanceof Error ? error.message.slice(0, 800) : "Không gửi được email.",
    }).eq("id", notificationId);
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const idSchema = z.string().uuid();

async function requireUser() {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login?next=/admin/notifications");
  return db;
}

export async function markNotificationRead(id: string) {
  const notificationId = idSchema.parse(id);
  const db = await requireUser();
  await db.from("notifications").update({
    is_read: true,
    read_at: new Date().toISOString(),
  }).eq("id", notificationId);
  revalidatePath("/admin/notifications");
}

export async function markAllNotificationsRead() {
  const db = await requireUser();
  await db.from("notifications").update({
    is_read: true,
    read_at: new Date().toISOString(),
  }).eq("is_read", false);
  revalidatePath("/admin/notifications");
}

export async function openNotification(id: string, actionUrl: string) {
  const notificationId = idSchema.parse(id);
  const safeUrl = actionUrl.startsWith("/admin") && !actionUrl.startsWith("//")
    ? actionUrl.slice(0, 300)
    : "/admin/notifications";
  const db = await requireUser();
  await db.from("notifications").update({
    is_read: true,
    read_at: new Date().toISOString(),
  }).eq("id", notificationId);
  redirect(safeUrl);
}

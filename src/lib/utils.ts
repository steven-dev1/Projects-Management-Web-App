import { NotificationType } from "@/types";
import { createClient } from "./supabaseClient";

const supabase = createClient();

export function capitalizeWords(str: string) {
  return str.toLowerCase().replace(/(^|\s)\w/g, (letra) => letra.toUpperCase());
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const getAvatarUrl = (avatarPath: string | null | undefined) => {
  if (!avatarPath) return undefined;
  return `${SUPABASE_URL}/storage/v1/object/public/avatars/${avatarPath}`;
};

export const getCardDateStatus = (dueDate: string | null | undefined, isCompleted?: boolean) => {
  if (!dueDate || isCompleted) return "none";
  const due = new Date(dueDate);
  const now = new Date();
  if (due < now) return "overdue";
  if (due < new Date(now.getTime() + 24 * 60 * 60 * 1000)) return "due-soon";
  return "ok";
};

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  url?: string;
}
export async function createNotification({ userId, type, title, message, url }: CreateNotificationParams) {
  await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    message,
    url,
  });
}

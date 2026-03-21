"use server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);

interface CreateNotificationParams {
  userId?: string;
  email?: string;
  type: string;
  title: string;
  message: string;
  url?: string;
  role?: "admin" | "member";
}

export async function createNotification({ userId, email, type, title, message, url, role }: CreateNotificationParams) {
  let userIdToUse = userId;

  if (!userIdToUse && email) {
    const { data, } = await supabaseAdmin.rpc("get_user_id_by_email", { p_email: email });
    userIdToUse = data;
    if (!userIdToUse) return;
  }

  await supabaseAdmin.from("notifications").insert({
    user_id: userIdToUse,
    type,
    title,
    message,
    url,
    role,
  });

  return { }
}

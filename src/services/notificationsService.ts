import { supabase } from "@/lib/supabase";

export const notificationsService = {
  async fetchAll() {
    return supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
  },

  async markAsRead(notificationId: string) {
    return supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);
  },

  async markAllAsRead() {
    return supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);
  },
};
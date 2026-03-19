import { supabase } from "@/lib/supabase";
import { UpdateUserProfileData } from "@/types";


export const authService = {
  async getSession() {
    return supabase.auth.getSession();
  },

  async getProfile(userId: string) {
    return supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", userId)
      .single();
  },

  async getPreferences(userId: string) {
    return supabase
      .from("user_preferences")
      .select("*")
      .eq("id", userId)
      .single();
  },

  async updateProfile(userId: string, data: Pick<UpdateUserProfileData, "full_name">) {
    return supabase
      .from("profiles")
      .update({ full_name: data.full_name?.trim() })
      .eq("id", userId);
  },

  async updatePreferences(userId: string, data: Pick<UpdateUserProfileData, "language" | "timezone">) {
    return supabase.from("user_preferences").update(data).eq("id", userId);
  },

  async getAvatarUrl(userId: string) {
    return supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();
  },

  getPublicAvatarUrl(path: string) {
    return supabase.storage.from("avatars").getPublicUrl(path);
  },
};
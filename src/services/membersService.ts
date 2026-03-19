import { supabase } from "@/lib/supabase";

export const membersService = {
  async remove(memberId: string) {
    return supabase.from("board_members").delete().eq("id", memberId);
  },

  async updateRole(memberId: string, role: "admin" | "member") {
    return supabase
      .from("board_members")
      .update({ role })
      .eq("id", memberId)
      .select("*, profiles!user_id(full_name, avatar_url)")
      .single();
  },
};
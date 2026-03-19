import { supabase } from "@/lib/supabase";
import { ListPayload, UpdateListPayload } from "@/store/features/boards/BoardsTypes";

export const listsService = {
  async create(payload: ListPayload) {
    return supabase
      .from("lists")
      .insert([{
        title: payload.title,
        board_id: payload.board_id,
        background_color: payload.background_color,
        position: payload.position,
      }])
      .select()
      .single();
  },

  async update(payload: UpdateListPayload) {
    return supabase.rpc("update_list", {
      p_list_id: payload.listId,
      p_title: payload.title,
      p_background_color: payload.background_color,
    });
  },

  async updateOrder(listId: string, newIndex: number, boardId: string) {
    return supabase.rpc("update_list_positions", {
      p_list_id: listId,
      p_new_position: newIndex,
      p_board_id: boardId,
    });
  },

  async archive(listId: string) {
    return supabase.rpc("archive_list", { p_list_id: listId });
  },

  async restore(listId: string) {
    const { error } = await supabase.rpc("restore_list", { p_list_id: listId });
    if (error) throw error;
    return supabase
      .from("lists")
      .select("*, cards!list_id(*)")
      .eq("id", listId)
      .eq("cards.status", "active")
      .single();
  },

  async delete(listId: string) {
    return supabase.from("lists").delete().eq("id", listId);
  },
};
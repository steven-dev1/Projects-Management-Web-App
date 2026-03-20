import { supabase } from "@/lib/supabase";
import { BoardForm, UpdatedBoardPayload } from "@/store/features/boards/BoardsTypes";


export const boardsService = {
  async fetchAll(userId: string) {
    return supabase
      .from("boards")
      .select(`
        *,
        board_members!inner(user_id),
        lists(
          id,
          cards(id, title, assigned_to, due_date, is_completed, status)
        )
      `)
      .eq("board_members.user_id", userId)
      .order("created_at", { ascending: false });
  },

  async fetchById(id: string) {
    return fetch(`/api/boards/${id}`);
  },

  async create(form: BoardForm) {
    return supabase.rpc("create_board_with_owner", {
      board_name: form.name,
      board_description: form.description ?? null,
      background_color: form.background_color ?? null,
    });
  },

  async update(payload: UpdatedBoardPayload) {
    return supabase
      .from("boards")
      .update({
        name: payload.name,
        description: payload.description,
        background_color: payload.background_color,
      })
      .eq("id", payload.boardId)
      .select()
      .single();
  },

  async archive(boardId: string) {
    return supabase.from("boards").update({ status: "archived" }).eq("id", boardId);
  },

  async restore(boardId: string) {
    return supabase
      .from("boards")
      .update({ status: "active" })
      .eq("id", boardId)
      .select()
      .single();
  },

  async delete(boardId: string) {
    return supabase.from("boards").delete().eq("id", boardId);
  },
};
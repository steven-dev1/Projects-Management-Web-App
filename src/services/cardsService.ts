import { supabase } from "@/lib/supabase";
import { CreateCardPayload, UpdateCardPayload } from "@/store/features/boards/BoardsTypes";


export const cardsService = {
  async create(payload: CreateCardPayload) {
    return supabase
      .from("cards")
      .insert([{
        title: payload.title,
        list_id: payload.list_id,
        due_date: payload.due_date ?? null,
        description: payload.description ?? null,
        position: payload.position,
      }])
      .select()
      .single();
  },

  async update(payload: UpdateCardPayload) {
    return supabase
      .from("cards")
      .update({
        title: payload.title,
        description: payload.description,
        due_date: payload.due_date,
      })
      .eq("id", payload.cardId)
      .select()
      .single();
  },

  async delete(cardId: string) {
    return supabase.from("cards").delete().eq("id", cardId);
  },

  async archive(cardId: string) {
    return supabase.rpc("archive_card", { p_card_id: cardId });
  },

  async restore(cardId: string) {
    return supabase
      .from("cards")
      .update({ status: "active" })
      .eq("id", cardId)
      .select("*, card_labels(*, labels(*))")
      .single();
  },

  async toggleCompletion(cardId: string, currentValue: boolean) {
    return supabase
      .from("cards")
      .update({ is_completed: !currentValue })
      .eq("id", cardId);
  },

  async assign(cardId: string, userId: string | null) {
    return supabase
      .from("cards")
      .update({ assigned_to: userId })
      .eq("id", cardId)
      .select()
      .single();
  },

  async updateOrder(cardId: string, newListId: string, newPosition: number, oldListId: string) {
    return supabase.rpc("update_card_positions", {
      p_card_id: cardId,
      p_new_list_id: newListId,
      p_new_position: newPosition,
      p_old_list_id: oldListId,
    });
  },
};
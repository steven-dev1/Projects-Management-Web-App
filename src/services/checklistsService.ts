import { supabase } from "@/lib/supabase";

export const checklistsService = {
  async create(cardId: string, title: string) {
    return supabase
      .from("checklists")
      .insert({ card_id: cardId, title, position: 0 })
      .select("*, items:checklist_items(*)")
      .single();
  },

  async delete(checklistId: string) {
    return supabase.from("checklists").delete().eq("id", checklistId);
  },

  async addItem(checklistId: string, title: string) {
    return supabase
      .from("checklist_items")
      .insert({ checklist_id: checklistId, title, position: 0 })
      .select()
      .single();
  },

  async toggleItem(itemId: string, isCompleted: boolean) {
    return supabase
      .from("checklist_items")
      .update({ is_completed: isCompleted })
      .eq("id", itemId);
  },

  async deleteItem(itemId: string) {
    return supabase.from("checklist_items").delete().eq("id", itemId);
  },

  async updateItem(itemId: string, title: string) {
    return supabase
      .from("checklist_items")
      .update({ title })
      .eq("id", itemId);
  },
};
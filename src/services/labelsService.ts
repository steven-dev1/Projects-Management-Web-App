import { supabase } from "@/lib/supabase";
import { Label } from "@/types";


export const labelsService = {
  async addToCard(cardId: string, label: Label) {
    return supabase
      .from("card_labels")
      .insert({ card_id: cardId, label_id: label.id });
  },

  async removeFromCard(cardId: string, labelId: string) {
    return supabase
      .from("card_labels")
      .delete()
      .eq("card_id", cardId)
      .eq("label_id", labelId);
  },

  async update(labelId: string, name: string) {
    return supabase
      .from("labels")
      .update({ name })
      .eq("id", labelId)
      .select()
      .single();
  },
};
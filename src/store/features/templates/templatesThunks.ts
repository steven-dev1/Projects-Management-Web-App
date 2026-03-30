import { createAsyncThunk } from "@reduxjs/toolkit";
import { boardTemplates } from "@/lib/templates";
import { LIST_COLORS } from "@/lib/consts";
import { supabase } from "@/lib/supabase";
import { Board } from "../boards/BoardsTypes";

export const createBoardFromTemplate = createAsyncThunk<
  Board,
  { templateId: string; boardName: string; backgroundColor: string; description: string },
  { rejectValue: string }
>("templates/createBoard", async ({ templateId, boardName, description, backgroundColor }, { rejectWithValue }) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return rejectWithValue("No autenticado");

    const template = boardTemplates.find((t) => t.id === templateId);
    if (!template) return rejectWithValue("Plantilla no encontrada");

    const { data: board, error: boardError } = await supabase.rpc("create_board_with_owner", {
      board_name: boardName,
      board_description: description,
      background_color: backgroundColor || boardTemplates[0].color,
    });

    if (boardError) return rejectWithValue(boardError.message);

    const listsWithCards = [];

    for (let i = 0; i < template.lists.length; i++) {
      const listTemplate = template.lists[i];

      const { data: list } = await supabase
        .from("lists")
        .insert({ title: listTemplate.name, board_id: board.id, position: i, status: "active", background_color: LIST_COLORS[0].id })
        .select()
        .single();

      if (!list) continue;

      let cards = [];

      if (listTemplate.cards.length > 0) {
        const { data: insertedCards } = await supabase
          .from("cards")
          .insert(
            listTemplate.cards.map((card, j) => ({
              title: card.title,
              list_id: list.id,
              position: j,
              status: "active",
            })),
          )
          .select();

        cards = insertedCards || [];
      }

      listsWithCards.push({ ...list, cards });
    }

    return {
      ...board,
      lists: listsWithCards,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creando board";
    return rejectWithValue(message);
  }
});

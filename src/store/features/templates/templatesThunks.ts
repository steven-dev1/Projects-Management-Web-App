import { createAsyncThunk } from "@reduxjs/toolkit";
import { boardTemplates } from "@/lib/templates";
import { supabase } from "@/lib/supabase";


export const createBoardFromTemplate = createAsyncThunk<
  void,
  { templateId: string; boardName: string },
  { rejectValue: string }
>("templates/createBoard", async ({ templateId, boardName }, { rejectWithValue }) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return rejectWithValue("No autenticado");

    const template = boardTemplates.find((t) => t.id === templateId);
    if (!template) return rejectWithValue("Plantilla no encontrada");

    const { data: board, error: boardError } = await supabase.rpc("create_board_with_owner", {
      board_name: boardName,
      board_description: null,
    });

    if (boardError) return rejectWithValue(boardError.message);

    for (let i = 0; i < template.lists.length; i++) {
      const listTemplate = template.lists[i];

      const { data: list, error: listError } = await supabase
        .from("lists")
        .insert({ title: listTemplate.name, board_id: board.id, position: i, status: "active" })
        .select()
        .single();

      if (listError) continue;

      if (listTemplate.cards.length > 0) {
        await supabase.from("cards").insert(
          listTemplate.cards.map((card, j) => ({
            title: card.title,
            list_id: list.id,
            position: j,
            status: "active",
          })),
        );
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creando board";
    return rejectWithValue(message);
  }
});

// e2e/helpers/board.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function resetTestBoard() {
  const boardId = process.env.TEST_BOARD_ID!;

  // Borrar todas las listas del board
  const { data: existingLists } = await supabase
    .from("lists")
    .select("id")
    .eq("board_id", boardId);

  if (existingLists && existingLists.length > 0) {
    const listIds = existingLists.map((l) => l.id);
    await supabase.from("cards").delete().in("list_id", listIds);
    await supabase.from("lists").delete().eq("board_id", boardId);
  }

  // Esperar un momento para asegurar que el borrado se completó
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { data: lists } = await supabase.from("lists").insert([
    { board_id: boardId, title: "Lista 1", position: 0, status: "active" },
    { board_id: boardId, title: "Lista 2", position: 1, status: "active" },
    { board_id: boardId, title: "Lista 3", position: 2, status: "active" },
  ]).select();

  if (!lists) return;

  await supabase.from("cards").insert([
    { list_id: lists[0].id, title: "Card 1A", position: 0, status: "active" },
    { list_id: lists[0].id, title: "Card 1B", position: 1, status: "active" },
    { list_id: lists[0].id, title: "Card 1C", position: 2, status: "active" },
    { list_id: lists[1].id, title: "Card 2A", position: 0, status: "active" },
    { list_id: lists[1].id, title: "Card 2B", position: 1, status: "active" },
    { list_id: lists[2].id, title: "Card 3A", position: 0, status: "active" },
    { list_id: lists[2].id, title: "Card 3B", position: 1, status: "active" },
  ]);
}
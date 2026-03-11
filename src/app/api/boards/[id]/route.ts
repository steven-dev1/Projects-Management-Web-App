import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { BoardList, Card } from "@/store/features/boards/BoardsTypes";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("boards")
    .select("*, lists!board_id (*, cards!list_id(*)), board_members (*, profiles!user_id (full_name, avatar_url))")
    .eq("id", id)
    .eq("lists.cards.status", "active")
    .order("position", { referencedTable: "lists", ascending: true })
    .order("position", { referencedTable: "lists.cards", ascending: true })
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (data) {
    data.lists = data.lists
      .filter((list: BoardList) => list.status === "active") // ← filtrar listas archivadas
      .map((list: BoardList) => ({
        ...list,
        cards: list.cards.filter((card: Card) => card.status === "active"),
      }));
  }

  return NextResponse.json(data);
}

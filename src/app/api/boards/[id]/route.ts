import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { BoardList } from "@/store/features/boards/BoardsTypes";
import { CardWithLabels } from "@/types";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("boards")
    .select(
      `
  *, 
  lists!board_id (
    *, 
    cards!list_id(
      *, 
      card_labels!card_id(
        label_id,
        labels(*)
      ),
      checklists(*, items:checklist_items(*))
    )
  ), 
  board_members (*, profiles!user_id (full_name, avatar_url)),
  labels(*)
  `,
    )
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
      .filter((list: BoardList) => list.status === "active")
      .map((list: BoardList) => ({
        ...list,
        cards: list.cards
          .filter((card: CardWithLabels) => card.status === "active")
          .map((card: CardWithLabels) => ({
            ...card,
            labels: card.card_labels?.map((cl) => cl.labels) ?? [],
          })),
      }));
  }

  return NextResponse.json(data);
}

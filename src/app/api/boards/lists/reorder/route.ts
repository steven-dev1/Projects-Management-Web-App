import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { listId, newIndex, boardId } = await request.json();

  const { error } = await supabase.rpc("update_list_positions", {
    p_list_id: listId,
    p_new_position: newIndex,
    p_board_id: boardId,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();

  if (body.title) {
    try {
      const { data, error } = await supabase
        .from("lists")
        .insert([
          {
            title: body.title,
            board_id: body.board_id,
            background_color: body.background_color,
            position: body.position,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creando lista:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, data });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error interno del servidor creando lista";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
  try {
    const { data, error } = await supabase.rpc("update_list_positions", {
      p_list_id: body.listId,
      p_new_position: body.newIndex,
      p_board_id: body.boardId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, data });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Error interno del servidor reordenando lists" }, { status: 500 });
  }
}
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();

  if (body.title) {
    try {
      const { data, error } = await supabase
        .from("cards")
        .insert([
          {
            title: body.title,
            list_id: body.list_id,
            due_date: body.due_date,
            description: body.description || null,
            position: body.position,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creando card:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, data });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error interno del servidor creando card";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
  try {
    const { data, error } = await supabase.rpc("update_card_positions", {
      p_card_id: body.cardId,
      p_new_list_id: body.newListId,
      p_new_position: body.newIndex,
      p_old_list_id: body.oldListId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, data });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Error interno del servidor reordenando cards" }, { status: 500 });
  }
}

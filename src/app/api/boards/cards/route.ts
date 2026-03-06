import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body  = await request.json();

  try {
    const { data, error } = await supabase.rpc("update_card_positions", {
      p_card_id: body.cardId,
      p_new_list_id: body.newListId,
      p_new_position: body.newIndex,
      p_old_list_id: body.oldListId,
    });

    if (error) {
      console.error("Error en RPC update_card_positions:", error);
      return NextResponse.json({ error: error.message || "No se pudo actualizar el card" }, { status: 400 });
    }
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

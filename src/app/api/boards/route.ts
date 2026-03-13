import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { Board, BoardForm, BoardResponse } from "@/store/features/boards/BoardsTypes";


export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  try {
    const body = (await request.json()) as BoardForm;

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "El nombre del tablero es obligatorio" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_board_with_owner", {
      board_name: body.name,
      board_description: body.description ?? null,
    });

    if (error) {
      console.error("Error en RPC create_board_with_owner:", error);
      return NextResponse.json({ error: error.message || "No se pudo crear el tablero" }, { status: 400 });
    }

    return NextResponse.json(data as BoardResponse, { status: 201 });
  } catch (err) {
    console.error("Error inesperado al crear board:", err);
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const supabase = await createServerSupabaseClient();

  try {
    const body: Board = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "El nombre del tablero es obligatorio" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("boards")
      .update({ name: body.name, description: body.description })
      .eq("id", body.id)
      .select()
      .single();
    if (error) throw error;

    if (error) {
      console.error("Error actualizando board: ", error);
      return NextResponse.json({ error: error || "No se pudo actualizar el tablero" }, { status: 400 });
    }

    return NextResponse.json(data as Board, { status: 201 });
  } catch (err) {
    console.error("Error inesperado al actualizar board:", err);
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createServerSupabaseClient();

  try {
    const body: Board = await request.json();
    if(!body.id) {
        return NextResponse.json({ error: "Falta el id del tablero" }, { status: 400 });
    }
    
    const { data, error } = await supabase.from("boards").delete().eq("id", body.id).select().single();
    if (error) throw error;

    if (error) {
      console.error("Error eliminando board: ", error);
      return NextResponse.json({ error: error || "No se pudo eliminar el tablero" }, { status: 400 });
    }

    return NextResponse.json(data as Board, { status: 201 });
  } catch (err) {
    console.error("Error inesperado al eliminar board:", err);
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}   

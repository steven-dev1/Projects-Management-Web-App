import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("boards")
    .select("*, lists (*, cards(*)), board_members (*, profiles!user_id (full_name,avatar_url))")
    .eq("id", id)
    .order("position", { referencedTable: "lists", ascending: true })
    .order("position", { referencedTable: "lists.cards", ascending: true })
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

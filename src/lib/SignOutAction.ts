'use server';
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOutAction() {
  const supabase = await createServerSupabaseClient(); 

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error en signOut server:", error);
  }

  revalidatePath("/dashboard", "layout");
  redirect("/signin");
}
import { InviteError } from "@/components/UI/InviteError";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Buscar la invitación
  const { data: invitation } = await supabase
    .from("invitations")
    .select("*, boards(name)")
    .eq("token", token)
    .eq("status", "pending")
    .single();

  if (!invitation) {
    return <InviteError message="Esta invitación no existe o ya fue usada." />;
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return <InviteError message="Esta invitación ha expirado." />;
  }

  // Si no está logueado, redirigir al login con redirect de vuelta
  if (!user) {
    redirect(`/signin?redirectTo=/invite/${token}`);
  }

  // Verificar que el email coincide
  if (user.email !== invitation.email) {
    return <InviteError message="Esta invitación fue enviada a otro email." />;
  }

  // Aceptar la invitación
  await supabase.from("board_members").insert({
    board_id: invitation.board_id,
    user_id: user.id,
    role: invitation.role,
  });

  await supabase
    .from("invitations")
    .update({ status: "accepted" })
    .eq("id", invitation.id);

  redirect(`/boards/${invitation.board_id}`);
}
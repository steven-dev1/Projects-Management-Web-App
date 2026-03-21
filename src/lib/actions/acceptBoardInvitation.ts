"use server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface AcceptBoardInvitationParams {
  boardId: string;
  userId: string;
  memberRole: "admin" | "member" | undefined;
  userEmail: string;
}

export async function acceptBoardInvitation({ boardId, userId, memberRole, userEmail }: AcceptBoardInvitationParams) {
  if (!boardId || !userId || !memberRole) {
    throw new Error("Faltan parámetros");
  }

  const { error } = await supabase.from("board_members").insert({
    board_id: boardId,
    user_id: userId,
    role: memberRole,
  });

  if (error) throw new Error(`Error al unirse al tablero: ${error.message}`);

  const { error: errorStatus } = await supabase
    .from("invitations")
    .update({ status: "accepted" })
    .eq("board_id", boardId)
    .eq('email', userEmail);

  if (errorStatus) {
    console.warn("Se unió al tablero pero no se pudo actualizar el estado de la invitación:", errorStatus.message);
  }
}

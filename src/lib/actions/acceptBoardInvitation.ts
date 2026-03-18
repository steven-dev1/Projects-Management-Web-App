'use server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface AcceptBoardInvitationParams {
  boardId: string;
  userId: string;
  memberRole: 'admin' | 'member' | undefined;
}

export async function acceptBoardInvitation({ boardId, userId, memberRole }: AcceptBoardInvitationParams) {
  const { error } = await supabase.from('board_members').insert({
    board_id: boardId,
    user_id: userId,
    role: memberRole,
  });
  const { error: errorStatus } = await supabase.from('invitations').update({ status: 'accepted' }).eq('board_id', boardId);
  if (error && errorStatus) throw new Error('Error al aceptar la invitación');
  if (errorStatus && !error) throw new Error('Se ha producido un error al actualizar la invitación como aceptada, pero se agregó correctamente al tablero');
}
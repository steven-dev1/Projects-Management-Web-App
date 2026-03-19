import { useAppSelector } from "@/store/hooks";

export function useCurrentUserRole() {
  const currentUser = useAppSelector((s) => s.auth.user);
  const boardMembers = useAppSelector((s) => s.boards.currentBoard?.board_members ?? []);
  const ownerId = useAppSelector((s) => s.boards.currentBoard?.owner_id);

  const currentMember = boardMembers.find((m) => m.user_id === currentUser?.id);
  const isAdmin = currentMember?.role === "admin";
  const isOwner = ownerId === currentUser?.id;

  return { isAdmin, isOwner, currentMember };
}
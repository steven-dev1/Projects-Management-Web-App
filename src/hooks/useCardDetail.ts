import { createNotification } from "@/lib/actions/createNotification";
import { useAppSelector } from "@/store/hooks";
import { useRef } from "react";

export function useCardDetail(cardId: string, onClose: () => void) {
  const card = useAppSelector((s) =>
    s.boards.currentBoard?.lists.flatMap((l) => l.cards).find((c) => c.id === cardId)
  );
  const list = useAppSelector((s) =>
    s.boards.currentBoard?.lists.find((l) => l.cards.some((c) => c.id === cardId))
  );
  const currentUserId = useAppSelector((s) => s.auth.user?.id);
  const currentBoard = useAppSelector((s) => s.boards.currentBoard);
  const initialAssignedTo = useRef<string | null>(card?.assigned_to ?? null);

  const handleClose = async () => {
    const finalAssignedTo = card?.assigned_to ?? null;
    if (
      finalAssignedTo &&
      finalAssignedTo !== initialAssignedTo.current &&
      finalAssignedTo !== currentUserId
    ) {
      try {
        await createNotification({
          userId: finalAssignedTo,
          type: "card_assigned",
          title: "Te asignaron a una tarjeta",
          message: `Fuiste asignado a "${card!.title}" en "${currentBoard?.name}"`,
          url: `/boards/${currentBoard?.id}`,
        });
      } catch (err) {
        console.error(err);
      }
    }
    onClose();
  };

  return { card, list, handleClose };
}
import { useAppSelector } from "@/store/hooks";
import { Divider, Modal, ModalBody, ModalContent } from "@heroui/react";
import { CardDetailTitle } from "./CardDetailTitle";
import { CardDetailDescription } from "./CardDetailDescription";
import { CardDetailActions } from "./CardDetailActions";
import { CardAssignee } from "./CardAssignee";
import { CardLabels } from "./CardLabels";
import { CardDetailDueDate } from "./CardDetailDueDate";
import { CardChecklists } from "./CheckLists/CardCheckLists";
import { useRef } from "react";
import { createNotification } from "@/lib/utils";

export const CardDetailModal = ({
  cardId,
  isOpen,
  onClose,
}: {
  cardId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const card = useAppSelector((state) =>
    state.boards.currentBoard?.lists.flatMap((l) => l.cards).find((c) => c.id === cardId),
  );
  const list = useAppSelector((state) =>
    state.boards.currentBoard?.lists.find((l) => l.cards.some((c) => c.id === cardId)),
  );
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const currentBoard = useAppSelector((state) => state.boards.currentBoard);

  const initialAssignedTo = useRef<string | null>(card?.assigned_to ?? null);

  const handleClose = async () => {
  const finalAssignedTo = card?.assigned_to ?? null;

  // si cambió y no se asignó a sí mismo
  if (
    finalAssignedTo &&
    finalAssignedTo !== initialAssignedTo.current &&
    finalAssignedTo !== currentUserId
  ) {
    await createNotification({
      userId: finalAssignedTo,
      type: "card_assigned",
      title: "Te asignaron a una tarjeta",
      message: `Fuiste asignado a "${card!.title}" en "${currentBoard?.name}"`,
      url: `/board/${currentBoard?.id}`,
    });
  }

  onClose();
};

  if (!card) return null;

  return (
    <Modal onOpenChange={(open) => !open && handleClose()} isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        <ModalBody className="p-0">
          <div className="flex flex-col md:flex-row gap-0 min-h-125">
            <div className="flex-1 p-6 flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col gap-1">
                <p className="text-xs text-zinc-400">
                  En la lista <span className="font-medium text-zinc-600">{list?.title}</span>
                </p>
                <CardDetailTitle card={card} />
              </div>

              <CardDetailDueDate card={card} />
              <CardLabels card={card} />
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Descripción</p>
                <CardDetailDescription card={card} />
                <CardChecklists card={card} />
              </div>
            </div>
            <div className="md:w-48 bg-zinc-50 p-4 flex flex-col gap-2 border-l border-zinc-100 rounded-r-xl">
              <CardAssignee card={card} />
              <Divider />
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Acciones</p>
              <CardDetailActions card={card} onClose={onClose} />
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

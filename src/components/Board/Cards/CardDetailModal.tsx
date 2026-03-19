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
import { createNotification } from "@/lib/actions/createNotification";

export const CardDetailModal = ({
  cardId,
  isOpen,
  onClose,
  isBoardClosed,
}: {
  cardId: string;
  isOpen: boolean;
  onClose: () => void;
  isBoardClosed: boolean;
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

    if (finalAssignedTo && finalAssignedTo !== initialAssignedTo.current && finalAssignedTo !== currentUserId) {
      try {
        await createNotification({
          userId: finalAssignedTo,
          type: "card_assigned",
          title: "Te asignaron a una tarjeta",
          message: `Fuiste asignado a "${card!.title}" en "${currentBoard?.name}"`,
          url: `/boards/${currentBoard?.id}`,
        });
      } catch (err: unknown) {
        console.error(err);
      }
    }
    onClose();
  };

  if (!card) return null;

  return (
    <Modal
      onOpenChange={(open) => !open && handleClose()}
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      backdrop="blur"
      scrollBehavior="inside"
      placement="center"
      classNames={{
        wrapper: "custom-scrollbar-modal",
        closeButton: "right-2 top-2 md:right-60 md:top-2 cursor-pointer",
      }}
    >
      <ModalContent>
        <ModalBody className="p-0">
          <div className="flex flex-col md:flex-row gap-0 min-h-auto md:min-h-125">
            <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 md:gap-6">
              {/* Header */}
              <div className="flex flex-col gap-1 pr-6 md:pr-0">
                <p className="text-xs text-zinc-400 dark:text-zinc-300">
                  En la lista: <span className="font-medium text-zinc-600 dark:text-white">{list?.title}</span>
                </p>
                <CardDetailTitle isBoardClosed={isBoardClosed} card={card} />
              </div>

              <CardDetailDueDate isBoardClosed={isBoardClosed} card={card} />
              <CardLabels isBoardClosed={isBoardClosed} card={card} />
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-300 uppercase tracking-wide">
                  Descripción
                </p>
                <CardDetailDescription isBoardClosed={isBoardClosed} card={card} />
                <CardChecklists isBoardClosed={isBoardClosed} card={card} />
              </div>
            </div>
            <div className="md:w-56 bg-zinc-50 dark:bg-zinc-900 dark:text-white p-4 flex flex-col gap-2 border-t md:border-t-0 md:border-l dark:border-zinc-800 border-zinc-100 md:rounded-r-xl">
              <CardAssignee isBoardClosed={isBoardClosed} card={card} />
              {!isBoardClosed && (
                <>
                  <Divider />
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Acciones</p>
                  <CardDetailActions card={card} onClose={onClose} />
                </>
              )}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

import { useAppSelector } from "@/store/hooks";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { CalendarIcon } from "lucide-react";
import { CardDetailTitle } from "./CardDetailTitle";
import { CardDetailDescription } from "./CardDetailDescription";
import { CardDetailActions } from "./CardDetailActions";

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

  if (!card) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
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

              {card.due_date && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Fecha límite</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={14} className="text-zinc-400" />
                    <span className="text-sm text-zinc-600">
                      {new Date(card.due_date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Descripción</p>
                <CardDetailDescription card={card} />
              </div>
            </div>
            <div className="md:w-48 bg-zinc-50 p-4 flex flex-col gap-2 border-l border-zinc-100 rounded-r-xl">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Acciones</p>
              <CardDetailActions card={card} onClose={onClose} />
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

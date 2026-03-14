import { useAppSelector } from "@/store/hooks";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { EditCardForm } from "./EditCardForm";

interface EditCardModalProps {
  cardId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCardModal = ({ cardId, isOpen, onClose }: EditCardModalProps) => {
  const card = useAppSelector((state) =>
    state.boards.currentBoard?.lists.flatMap((l) => l.cards).find((c) => c.id === cardId),
  );

  if (!card) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Editar tarjeta</ModalHeader>
        <ModalBody>
          <EditCardForm card={card} onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

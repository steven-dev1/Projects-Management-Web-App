import { useAppSelector } from "@/store/hooks";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { EditListForm } from "./EditListForm";

interface EditListModalProps {
  listId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EditListModal = ({ listId, isOpen, onClose }: EditListModalProps) => {
  const list = useAppSelector((state) =>
    state.boards.currentBoard?.lists.find((l) => l.id === listId),
  );

  if (!list) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Editar lista</ModalHeader>
        <ModalBody>
          <EditListForm list={list} onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { CardDetailBody } from "./CardDetailBody";
import { CardDetailSidebar } from "./CardDetailSideBar";
import { useCardDetail } from "@/hooks/useCardDetail";

export const CardDetailModal = ({
  cardId,
  isOpen,
  onClose,
}: {
  cardId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { card, list, handleClose } = useCardDetail(cardId, onClose);

  if (!card) return null;

  return (
     <Modal
      onOpenChange={(open) => !open && handleClose()}
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      backdrop="blur"
      scrollBehavior="outside"
      placement="center"
      classNames={{
        wrapper: "!overflow-hidden my-4",
        closeButton: "right-2 top-2 md:right-60 md:top-2 cursor-pointer",
      }}
    >
      <ModalContent>
        <ModalBody className="p-0">
          <div className="flex flex-col md:flex-row gap-0 h-[calc(100vh-100px)] max-w-4xl overflow-hidden">
            <CardDetailBody card={card} listTitle={list?.title ?? ""} />
            <CardDetailSidebar card={card} onClose={onClose} />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { CardDetailBody } from "./CardDetailBody";
import { CardDetailSidebar } from "./CardDetailSideBar";
import { useCardDetail } from "@/hooks/useCardDetail";

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
  const { card, list, handleClose } = useCardDetail(cardId, onClose);

  if (!card) return null;

  return (
     <Modal
      onOpenChange={(open) => !open && handleClose()}
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
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
          <div className="flex flex-col md:flex-row gap-0 min-h-auto md:min-h-125 max-w-4xl">
            <CardDetailBody card={card} listTitle={list?.title ?? ""} isBoardClosed={isBoardClosed} />
            <CardDetailSidebar card={card} isBoardClosed={isBoardClosed} onClose={onClose} />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

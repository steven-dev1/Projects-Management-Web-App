import { Button, Modal, ModalBody, ModalContent } from "@heroui/react";

export const ConfirmDeleteModal = ({
  title,
  isOpen,
  onClose,
  onConfirm,
  description,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  description: string;
}) => (
  <Modal isOpen={isOpen} onClose={onClose} onOpenChange={(open) => !open && onClose()} placement="center" size="sm">
    <ModalContent>
      {() => (
        <>
          <ModalBody className="py-4">
            <div className="flex flex-col gap-1">
              <h6 className="font-semibold">{title}</h6>
              <p className="text-sm text-zinc-500 dark:text-zinc-300">{description}</p>
            </div>
            <div className="flex gap-2 items-center justify-end mt-2">
              <Button size="sm" variant="flat" onPress={onClose}>
                Cancelar
              </Button>
              <Button size="sm" color="danger" variant="flat" onPress={onConfirm}>
                Eliminar
              </Button>
            </div>
          </ModalBody>
        </>
      )}
    </ModalContent>
  </Modal>
);

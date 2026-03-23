import { useDisclosure } from "@heroui/react";
import { createContext, useContext, useState } from "react";
import { ConfirmDeleteModal } from "../UI/ConfirmDeleteModal";

const ConfirmDeleteContext = createContext<{
  confirm: (title: string, description: string, onConfirm: () => void) => void;
}>({ confirm: () => {} });

export const ConfirmDeleteProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<{title: string; description: string; onConfirm: () => void } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const confirm = (title: string, description: string, onConfirm: () => void) => {
    setState({title, description, onConfirm });
    onOpen();
  };

  const handleConfirm = () => {
    state?.onConfirm();
    onClose();
  };

  return (
    <ConfirmDeleteContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDeleteModal
        title={state?.title ?? "¿Eliminar?"}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleConfirm}
        description={state?.description ?? ""}
      />
    </ConfirmDeleteContext.Provider>
  );
};

export const useConfirmDelete = () => useContext(ConfirmDeleteContext);
'use client'
import { addToast, Button, Divider, Input, Modal, ModalBody, ModalContent, ModalHeader, Spinner } from "@heroui/react";
import { ColorPicker } from "../Board/Lists/ColorPicker";
import { updateBoard } from "@/store/features/boards/BoardsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useState } from "react";

export const EditBoardModal = ({ boardId, isOpen, onClose }: {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const board = useAppSelector((state) =>
    state.boards.boards.find((b) => b.id === boardId)
  );
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(board?.background_color ?? "#a742ff");

  if (!board) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name) return;
    setLoading(true);
    try {
      await dispatch(updateBoard({
        boardId,
        name,
        description,
        background_color: selectedColor,
      })).unwrap();
      onClose();
    } catch {
      addToast({ title: "Error al actualizar el proyecto", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} placement="top-center">
      <ModalContent>
        <ModalHeader>Editar proyecto</ModalHeader>
        <Divider />
        <ModalBody className="py-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              name="name"
              label="Nombre"
              defaultValue={board.name}
              isRequired
            />
            <Input
              name="description"
              label="Descripción"
              defaultValue={board.description}
            />
            <div className="flex flex-col gap-2">
              <p className="text-sm text-zinc-500">Color de acento</p>
              <ColorPicker value={selectedColor} onChange={setSelectedColor} />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="flat" onPress={onClose}>Cancelar</Button>
              <Button className="bg-morado text-white" type="submit">
                {loading ? <Spinner size="sm" color="default" /> : "Guardar"}
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
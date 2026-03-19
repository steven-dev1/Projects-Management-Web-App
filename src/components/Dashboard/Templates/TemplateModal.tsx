"use client";

import { BoardTemplate } from "@/lib/templates";
import { createBoardFromTemplate } from "@/store/features/templates/templatesThunks";
import { useAppDispatch } from "@/store/hooks";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TemplateModal({
  template,
  isOpen,
  onClose,
}: {
  template: BoardTemplate;
  isOpen: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [boardName, setBoardName] = useState(template.name);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!boardName.trim()) {
      setError("El nombre es requerido");
      return;
    }

    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await dispatch(
        createBoardFromTemplate({ templateId: template.id, boardName: boardName.trim() }),
      ).unwrap();

      onClose();
      router.push("/dashboard/projects");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creando el board");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal placement="center" backdrop="blur" isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <span>{template.icon}</span>
          <span>{template.name}</span>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-zinc-500 mb-2">{template.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {template.lists.map((list) => (
              <span key={list.name} className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                {list.name}
              </span>
            ))}
          </div>

          <Input
            label="Nombre del board"
            placeholder="Ej: Mi proyecto"
            value={boardName}
            onChange={(e) => {
              setBoardName(e.target.value);
              setError("");
            }}
            isInvalid={!!error}
            errorMessage={error}
            autoFocus
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleCreate} isLoading={isLoading}>
            Crear board
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

'use client'
import { Board } from "@/store/features/boards/BoardsTypes";
import { createBoard,  } from "@/store/features/boards/BoardsThunks";
import { useAppDispatch } from "@/store/hooks";
import {addToast,Button,Divider,Form,Input,Modal,ModalBody,ModalContent,ModalHeader,Spinner,useDisclosure} from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LIST_COLORS } from "@/lib/consts";
import { ColorPicker } from "../Board/Lists/ColorPicker";

export default function ButtonCreateProject({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(LIST_COLORS[0].id);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleSubmit = async (formData: FormData, e: React.SyntheticEvent) => {
    e.preventDefault();
    const data = Object.fromEntries(formData) as unknown as Board;
    const newName = data.name || "";
    const newDescription = data.description;

    if (!data.name) {
      console.error("Faltan campos requeridos");
      return;
    }
    setLoading(true);
    try {
      const result = await dispatch(createBoard({ name: newName, description: newDescription, background_color: selectedColor })).unwrap();
      router.push(`/boards/${result.id}`);
      addToast({
        title: "Proyecto creado",
        color: "success",
        icon: "Check",
      });
      setLoading(false);
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear proyecto";
      setLoading(false);
      addToast({ title: errorMessage, color: "danger" });
    }
  };
  return (
    <>
      <Button color="primary" size={size} className={"min-w-fit whitespace-nowrap " + className} onPress={onOpen}>
        Crear
      </Button>
      <Modal backdrop="blur" isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear tablero</ModalHeader>
              <Divider className="my-2" />
              <ModalBody>
                <Form
                  className="w-full"
                  onSubmit={(e) => {
                    handleSubmit(new FormData(e.currentTarget), e);
                  }}
                >
                  <Input
                    name="name"
                    label="Nombre del proyecto"
                    placeholder="Escribe el nombre del tablero"
                    isRequired
                  />
                  <Input
                    name="description"
                    label="Descripción (Opcional)"
                    placeholder="Escribe una descripción del tablero"
                  />
                  <ColorPicker value={selectedColor} onChange={setSelectedColor} />
                  <div className="w-full h-8 rounded-lg transition-colors duration-200" style={{ backgroundColor: selectedColor }} />
                  <div className="flex items-center gap-2 justify-end w-full mt-2">
                    <Button variant="flat" onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button color="primary" type="submit">
                      {loading ? <Spinner color="default" size="sm" /> : "Crear"}
                    </Button>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

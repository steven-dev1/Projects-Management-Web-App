'use client'
import { Board } from "@/store/features/boards/BoardsTypes";
import { createBoard,  } from "@/store/features/boards/BoardsThunks";
import { useAppDispatch } from "@/store/hooks";
import {addToast,Button,Divider,Form,Input,Modal,ModalBody,ModalContent,ModalHeader,Spinner,useDisclosure} from "@heroui/react";
import { useState } from "react";

export default function ButtonCreateProject({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await dispatch(createBoard({ name: newName, description: newDescription })).unwrap();
      // dispatch(fetchBoards());
      addToast({
        title: "Proyecto creado",
        color: "success",
        icon: "Check",
      });
      setLoading(false);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (rejectedValueOrError) {
      setLoading(false);
      addToast({ title: "Error al crear proyecto", color: "danger" });
    }
  };
  return (
    <>
      <Button color="primary" size={size} className="min-w-fit whitespace-nowrap hidden sm:block" onPress={onOpen}>
        Crear
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear tarea</ModalHeader>
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
                    placeholder="Escribe el nombre del proyecto"
                    isRequired
                  />
                  <Input
                    name="description"
                    label="Descripción (Opcional)"
                    placeholder="Escribe una descripción del proyecto"
                  />
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

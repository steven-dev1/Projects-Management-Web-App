import { Card } from "@/store/features/boards/BoardsTypes";
import { createCard } from "@/store/features/boards/CardsThunks";
import { useAppDispatch } from "@/store/hooks";
import {
  addToast,
  Button,
  DateInput,
  Divider,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { getLocalTimeZone, now } from "@internationalized/date";
import { Plus } from "lucide-react";
import { useState } from "react";

type CreateCardButtonProps = {
  listId: string;
  boardId: string;
  lastPosition: number;
};

export default function CreateCardButton({ listId, lastPosition }: CreateCardButtonProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const zonaHoraria = getLocalTimeZone();
  const tiempoActual = now(zonaHoraria);

  const handleSubmit = async (formData: FormData, e: React.SyntheticEvent) => {
    e.preventDefault();
    const data = Object.fromEntries(formData) as unknown as Card;
    const newTitle = data.title || "";
    const newDescription = data.description;

    if (!data.title) {
      console.error("Faltan campos requeridos");
      return;
    }
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await dispatch(
        createCard({ title: newTitle, description: newDescription, list_id: listId, due_date: data.due_date, position: lastPosition }),
      ).unwrap();
      addToast({
        title: "Tarea creada",
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
      <Button className="w-full min-w-fit" variant="flat" onPress={onOpen}>
        <Plus size={18} />
        <span className="hidden sm:inline">Añadir tarjeta</span>
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear nuevo proyecto</ModalHeader>
              <Divider className="my-2" />
              <ModalBody>
                <Form
                  className="w-full"
                  onSubmit={(e) => {
                    handleSubmit(new FormData(e.currentTarget), e);
                  }}
                >
                  <Input
                    autoFocus
                    name="title"
                    label="Nombre de la tarea"
                    placeholder="Escribe el nombre de la tarea"
                    isRequired
                  />
                  <Input
                    name="description"
                    label="Descripción (Opcional)"
                    placeholder="Escribe una descripción de la tarea"
                  />
                  <DateInput name="due_date" label="Date and time" defaultValue={tiempoActual} minValue={tiempoActual} />

                  <div className="flex items-center gap-2 justify-end w-full mt-2">
                    <Button variant="flat" onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button className="bg-morado text-white" type="submit">
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

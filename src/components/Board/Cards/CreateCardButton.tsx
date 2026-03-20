import { CreateCardPayload } from "@/store/features/boards/BoardsTypes";
import { createCard } from "@/store/features/boards/CardsThunks";
import { useAppDispatch } from "@/store/hooks";
import {
  addToast,
  Button,
  DatePicker,
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
import { getLocalTimeZone, now, ZonedDateTime } from "@internationalized/date";
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
  const [dueDate, setDueDate] = useState<ZonedDateTime | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const zonaHoraria = getLocalTimeZone()
  const tiempoActual = now(zonaHoraria)

  const handleSubmit = async (formData: FormData, e: React.SyntheticEvent) => {
    e.preventDefault();
    const data = Object.fromEntries(formData) as unknown as CreateCardPayload;
    const newTitle = data.title || "";
    const newDescription = data.description;

    if (!data.title) {
      addToast({ title: "Faltan campos requeridos", color: "danger" });
      console.error("Faltan campos requeridos");
      return;
    }
    setLoading(true);
    try {
      await dispatch(
        createCard({
          title: newTitle,
          description: newDescription,
          list_id: listId,
          due_date: dueDate?.toDate().toISOString() ?? undefined,
          position: lastPosition,
        }),
      ).unwrap();
      addToast({
        title: "Tarea creada",
        color: "success",
        icon: "Check",
      });
      setLoading(false);
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear tarea";
      setLoading(false);
      addToast({ title: errorMessage , color: "danger" });
    }
  };
  return (
    <>
      <Button className="w-full min-w-fit" variant="light" onPress={onOpen}>
        <Plus size={18} />
        <span className="inline sm:hidden">Añadir</span>
        <span className="hidden sm:inline">Añadir tarjeta</span>
      </Button>
      <Modal backdrop="blur" isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
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
                  <DatePicker
                    name="due_date"
                    hideTimeZone
                    label="Fecha límite"
                    isRequired={false}
                    value={dueDate}
                    defaultValue={tiempoActual}
                    granularity="minute"
                    onChange={setDueDate}
                    minValue={tiempoActual}
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

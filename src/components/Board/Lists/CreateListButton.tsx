import { LIST_COLORS } from "@/lib/consts";
import { createList } from "@/store/features/boards/ListsThunks";
import { useAppDispatch } from "@/store/hooks";
import {
    addToast,
  Button,
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
import { Plus } from "lucide-react";
import { useState } from "react";
import { ColorPicker } from "./ColorPicker";

export default function CreateListButton({ boardId, lastPosition }: { boardId: string; lastPosition: number }) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(LIST_COLORS[0].value);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();


  const handleSubmit = async (formData: FormData, e: React.SyntheticEvent) => {
    e.preventDefault();
    const data = Object.fromEntries(formData) as unknown as { title: string; description: string };
    const newTitle = data.title || "";

    if (!data.title) {
      console.error("Faltan campos requeridos");
      return;
    }
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await dispatch(
        createList({ title: newTitle, board_id: boardId, background_color: selectedColor, position: lastPosition }),
      ).unwrap();
      addToast({
        title: "Lista creada",
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
      <Button className="min-w-fit w-72" variant="flat" onPress={onOpen}>
        <Plus size={18} />
        Crear lista
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
                  <div className="w-full">
                    <p className="text-sm text-zinc-500 mb-2">Color de fondo</p>
                    <ColorPicker value={selectedColor} onChange={setSelectedColor} />
                  </div>
                  <div
                    className="w-full h-8 rounded-lg transition-colors duration-200"
                    style={{ backgroundColor: selectedColor }}
                  />
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

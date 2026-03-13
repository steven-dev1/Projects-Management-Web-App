import { Card, UpdateCardPayload } from "@/store/features/boards/BoardsTypes";
import { updateCard } from "@/store/features/boards/CardsThunks";
import { useAppDispatch } from "@/store/hooks";
import { addToast, Button, DateInput, Form, Input, Spinner } from "@heroui/react";
import { getLocalTimeZone, now, parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";
import { useState } from "react";

export const EditCardForm = ({ card, onClose }: { card: Card; onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState<ZonedDateTime | null>(
    card.due_date ? parseAbsoluteToLocal(card.due_date) : now(getLocalTimeZone()),
  );

  const handleSubmit = async (formData: FormData, e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(formData) as unknown as UpdateCardPayload;
    const { title, description } = data;
    if (!title) return;
    setLoading(true);
    try {
      await dispatch(
        updateCard({
          cardId: card.id!,
          title,
          description,
          due_date: (dueDate ?? now(getLocalTimeZone())).toDate().toISOString(),
        }),
      ).unwrap();
      onClose();
    } catch {
      addToast({ title: "Error al actualizar la tarjeta", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={(e) => handleSubmit(new FormData(e.currentTarget), e)}>
      <Input name="title" defaultValue={card.title} label="Título" placeholder="Escribe el título de la tarjeta" />
      <Input
        name="description"
        defaultValue={card.description}
        label="Descripción"
        placeholder="Escribe la descripción de la tarjeta"
      />
      <DateInput label="Fecha límite" defaultValue={dueDate} onChange={setDueDate} />
      <div className="flex items-center gap-2">
        <Button variant="flat" onPress={onClose}>
          Cancelar
        </Button>
        <Button variant="flat" type="submit">
          {loading ? <Spinner color="default" size="sm" /> : "Guardar"}
        </Button>
      </div>
    </Form>
  );
};

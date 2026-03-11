import { Card } from "@/store/features/boards/BoardsTypes";
import { archiveCard, deleteCard, toggleCardCompletion } from "@/store/features/boards/CardsThunks";
import { useAppDispatch } from "@/store/hooks";
import { Button, Divider } from "@heroui/react";
import { ArchiveIcon, CheckSquare, Trash2 } from "lucide-react";

export const CardDetailActions = ({ card, onClose }: { card: Card; onClose: () => void }) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <Button
        size="sm"
        variant="flat"
        className="justify-start"
        startContent={<CheckSquare size={14} />}
        onPress={() => dispatch(toggleCardCompletion(card.id!))}
      >
        {card.is_completed ? "Reabrir" : "Completar"}
      </Button>
      <Button
        size="sm"
        variant="flat"
        className="justify-start"
        startContent={<ArchiveIcon size={14} />}
        onPress={async () => {
          await dispatch(archiveCard(card.id!)).unwrap();
          onClose();
        }}
      >
        Archivar
      </Button>
      <Divider className="my-1" />
      <Button
        size="sm"
        variant="flat"
        color="danger"
        className="justify-start"
        startContent={<Trash2 size={14} />}
        onPress={async () => {
          await dispatch(deleteCard(card.id!)).unwrap();
          onClose();
        }}
      >
        Eliminar
      </Button>
    </>
  );
};
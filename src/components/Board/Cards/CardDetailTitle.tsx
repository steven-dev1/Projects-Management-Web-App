import { Card } from "@/store/features/boards/BoardsTypes";
import { updateCard } from "@/store/features/boards/CardsThunks";
import { useAppDispatch } from "@/store/hooks";
import { Input } from "@heroui/react";
import { useState } from "react";

export const CardDetailTitle = ({ card, isBoardClosed }: { card: Card; isBoardClosed: boolean }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

  const handleSave = async () => {
    if (!title || title === card.title) return setEditing(false);
    await dispatch(updateCard({ cardId: card.id!, title, description: card.description })).unwrap();
    setEditing(false);
  };

  const handleEdit = () => {
    if (isBoardClosed) return;
    setEditing(true);
  };

  if (editing && !isBoardClosed) {
    return (
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") setEditing(false);
        }}
        classNames={{ input: "text-lg font-semibold" }}
      />
    );
  }

  return (
    <h2
      className="text-lg font-semibold dark:text-zinc-300 text-zinc-800 cursor-pointer dark:hover:bg-zinc-800 hover:bg-zinc-100 rounded-lg py-1.5 px-2 -mx-1"
      onClick={() => handleEdit()}
    >
      {card.title}
    </h2>
  );
};
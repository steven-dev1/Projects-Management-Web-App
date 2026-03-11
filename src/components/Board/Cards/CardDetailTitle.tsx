import { Card } from "@/store/features/boards/BoardsTypes";
import { updateCard } from "@/store/features/boards/CardsThunks";
import { useAppDispatch } from "@/store/hooks";
import { Input } from "@heroui/react";
import { useState } from "react";

export const CardDetailTitle = ({ card }: { card: Card }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

  const handleSave = async () => {
    if (!title || title === card.title) return setEditing(false);
    await dispatch(updateCard({ cardId: card.id!, title, description: card.description })).unwrap();
    setEditing(false);
  };

  if (editing) {
    return (
      <Input
        autoFocus
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
      className="text-lg font-semibold text-zinc-800 cursor-pointer hover:bg-zinc-100 rounded px-1 -mx-1 transition-colors"
      onClick={() => setEditing(true)}
    >
      {card.title}
    </h2>
  );
};
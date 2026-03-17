import { Card } from "@/store/features/boards/BoardsTypes";
import { updateCard } from "@/store/features/boards/CardsThunks";
import { useAppDispatch } from "@/store/hooks";
import { useState } from "react";
import { RichTextEditor } from "../RichTextEditor";
import { RichTextViewer } from "../RichTextViewer";

export const CardDetailDescription = ({ card, isBoardClosed }: { card: Card; isBoardClosed: boolean }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);

  const handleSave = async (html: string) => {
    if (html === card.description) return setEditing(false);
    await dispatch(updateCard({
      cardId: card.id!,
      title: card.title,
      description: html, // guardamos HTML directamente
    })).unwrap();
    setEditing(false);
  };

  if (editing && !isBoardClosed) {
    return (
      <RichTextEditor
        content={card.description ?? ""}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return <RichTextViewer isBoardClosed={isBoardClosed} content={card.description ?? ""} onClick={() => setEditing(true)} />;
};
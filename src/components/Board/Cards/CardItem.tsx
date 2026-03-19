import { Card } from "@/store/features/boards/BoardsTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import CardView from "./CardView";

export default function CardItem({ card, index, isClosed }: { card: Card; index: number; isClosed: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id as string,
    data: { type: "card", index },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none',
  };

  return (
    <div data-type="card"  ref={setNodeRef} style={style}  className={`bg-white dark:bg-zinc-900 m-1 rounded-lg`}>
      <CardView isClosed={isClosed} card={card} dragListeners={listeners} dragAttributes={attributes} />
    </div>
  );
}


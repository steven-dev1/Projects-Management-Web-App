import { Card } from "@/store/features/boards/BoardsTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import CardView from "./CardView";

export default function CardItem({ card }: { card: Card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id as string,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style}  className={` transition-all duration-150 border-2  ${card.is_completed ? " border-emerald-300 bg-emerald-50 shadow-emerald-100 shadow-md" : "border-transparent bg-white shadow"}  p-2 mb-2 rounded-lg`}>
      <CardView card={card} dragListeners={listeners} dragAttributes={attributes}/>
    </div>
  );
}


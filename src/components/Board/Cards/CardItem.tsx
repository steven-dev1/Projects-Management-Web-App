import { Card } from "@/store/features/boards/BoardsTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import CardView from "./CardView";
import { useDisclosure } from "@heroui/react";

export default function CardItem({ card }: { card: Card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id as string,
  });
  const { onOpen} = useDisclosure();

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style}  className={` transition-all duration-150 shadow bg-white p-2 mb-2 rounded-lg`}>
      <CardView card={card} dragListeners={listeners} dragAttributes={attributes} onOpenDetail={onOpen}/>
    </div>
  );
}


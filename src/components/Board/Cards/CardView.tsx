import { Card } from "@/store/features/boards/BoardsTypes";

interface CardViewProps {
  card: Card;
  isOverlay?: boolean; // Para aplicar estilos extra si está flotando
}

export default function CardView({ card, isOverlay }: CardViewProps) {
  return (
    <div 
      className={`
        p-3 rounded select-none w-full
        ${isOverlay 
          ? "bg-white border-purple-400 shadow-2xl" 
          : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700"}
      `}
    >
      <h4 className="font-medium text-zinc-800 dark:text-zinc-100">
        {card.title}
      </h4>
      {card.description && (
        <p className="text-xs text-zinc-500 mt-1 truncate">
          {card.description}
        </p>
      )}
    </div>
  );
}
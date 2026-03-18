import { BoardResponse, Card } from "@/store/features/boards/BoardsTypes";
import { Label } from "@/types";
import { Chip } from "@heroui/react";
import { format, isPast } from "date-fns";
import { es } from "date-fns/locale/es";

export default function UpcomingCards({ upcomingCards, board, setSelectedCard, onOpen, labelStats }: { upcomingCards: Card[], board: BoardResponse, setSelectedCard: (cardId: string) => void, onOpen: () => void, labelStats: { label: Label; count: number }[] }) {
  return (
    <div
      className={`bg-content1 col-span-3 rounded-2xl p-5 shadow-small flex flex-col gap-2 ${labelStats.length === 0 ? "lg:col-span-2" : ""}`}
    >
      <p className="text-sm font-semibold mb-1">Fechas límite</p>
      {upcomingCards.length === 0 ? (
        <p className="text-sm text-default-400 text-center py-4">Sin fechas próximas 🎉</p>
      ) : (
        upcomingCards.map((card) => {
          const isOver = isPast(new Date(card.due_date!));
          const listName = board.lists.find((l) => l.cards.some((c) => c.id === card.id))?.title;
          return (
            <button
              key={card.id}
              onClick={() => {
                setSelectedCard(card.id);
                onOpen();
              }}
              className="flex cursor-pointer items-center justify-between p-2 rounded-xl hover:bg-default-100 transition-colors text-left"
            >
              <div className="min-w-0">
                <p className="text-sm dark:text-white truncate">{card.title}</p>
                {listName && <p className="text-xs text-default-400">{listName}</p>}
              </div>
              <Chip size="sm" color={isOver ? "danger" : "warning"} variant="flat" className="shrink-0 ml-2">
                {format(new Date(card.due_date!), "dd MMM", { locale: es })}
              </Chip>
            </button>
          );
        })
      )}
    </div>
  );
}

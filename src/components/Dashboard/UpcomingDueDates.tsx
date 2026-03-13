"use client";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale/es";
import { Board, Card } from "@/store/features/boards/BoardsTypes";

interface Props {
  cards: Card[];
  boards: Board[];
}

export default function UpcomingDueDates({ cards, boards }: Props) {
  const router = useRouter();

  if (cards.length === 0) {
    return <p className="text-sm text-zinc-400">No hay fechas límite próximas.</p>;
  }

  const findBoardByCard = (card: Card) =>
    boards.find((b) => b.lists?.some((l) => l.cards?.some((c) => c.id === card.id)));

  const sorted = [...cards].sort(
    (a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
  );

  return (
    <div className="flex flex-col gap-2">
      {sorted.slice(0, 5).map((card) => {
        const board = findBoardByCard(card);
        const daysLeft = differenceInDays(new Date(card.due_date!), new Date());
        const isUrgent = daysLeft <= 2;

        return (
          <div
            key={card.id}
            className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors"
            onClick={() => board && router.push(`/boards/${board.id}`)}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-zinc-700">{card.title}</span>
              {board && <span className="text-xs text-zinc-400">{board.name}</span>}
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className={`text-xs font-medium ${isUrgent ? "text-red-500" : "text-zinc-500"}`}>
                {format(new Date(card.due_date!), "dd MMM", { locale: es })}
              </span>
              <span className={`text-xs ${isUrgent ? "text-red-400" : "text-zinc-400"}`}>
                {daysLeft === 0 ? "Hoy" : daysLeft === 1 ? "Mañana" : `En ${daysLeft} días`}
              </span>
            </div>
          </div>
        );
      })}
      {cards.length > 5 && (
        <p className="text-xs text-zinc-400 text-center">+{cards.length - 5} más</p>
      )}
    </div>
  );
}
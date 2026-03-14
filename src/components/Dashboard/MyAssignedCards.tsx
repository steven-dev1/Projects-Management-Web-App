"use client";
import { useRouter } from "next/navigation";
import { Chip } from "@heroui/react";
import { Board, Card } from "@/store/features/boards/BoardsTypes";

interface Props {
  cards: Card[];
  boards: Board[];
}

export default function MyAssignedCards({ cards, boards }: Props) {
  const router = useRouter();

  if (cards.length === 0) {
    return <p className="text-sm text-zinc-400">No tienes tarjetas asignadas.</p>;
  }

  const findBoardByCard = (card: Card) =>
    boards.find((b) => b.lists?.some((l) => l.cards?.some((c) => c.id === card.id)));

  return (
    <div className="flex flex-col gap-2">
      {cards.slice(0, 5).map((card) => {
        const board = findBoardByCard(card);
        return (
          <div
            key={card.id}
            className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors"
            onClick={() => board && router.push(`/boards/${board.id}`)}
          >
            <div className="flex flex-col gap-0.5">
              <span className={`text-sm font-medium ${card.is_completed ? "line-through text-zinc-400" : "text-zinc-700"}`}>
                {card.title}
              </span>
              {board && <span className="text-xs text-zinc-400">{board.name}</span>}
            </div>
            <Chip size="sm" variant="flat" color={card.is_completed ? "success" : "default"}>
              {card.is_completed ? "Completada" : "Pendiente"}
            </Chip>
          </div>
        );
      })}
      {cards.length > 5 && (
        <p className="text-xs text-zinc-400 text-center">+{cards.length - 5} más</p>
      )}
    </div>
  );
}
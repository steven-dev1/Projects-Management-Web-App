"use client";
import { BoardResponse } from "@/store/features/boards/BoardsTypes";
import { useDisclosure } from "@heroui/react";
import { useState, useMemo } from "react";
import { CardDetailModal } from "../Cards/CardDetailModal";
import { isPast, isWithinInterval, addDays } from "date-fns";
import GeneralProgress from "./GeneralProgress";
import CardsByList from "./CardsByList";
import PanelMembers from "./PanelMembers";
import LabelStats from "./LabelStats";
import UpcomingCards from "./UpcomingCards";

export default function BoardPanel({ board }: { board: BoardResponse }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const allCards = useMemo(() => board.lists.flatMap((l) => l.cards), [board.lists]);

  const total = allCards.length;
  const completed = allCards.filter((c) => c.is_completed).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const overdue = allCards.filter((c) => c.due_date && !c.is_completed && isPast(new Date(c.due_date)));
  const dueSoon = allCards.filter(
    (c) =>
      c.due_date &&
      !c.is_completed &&
      isWithinInterval(new Date(c.due_date), { start: new Date(), end: addDays(new Date(), 7) }),
  );

  const memberStats = board.board_members.map((m) => {
    const cards = allCards.filter((c) => c.assigned_to === m.user_id);
    return { member: m, total: cards.length, completed: cards.filter((c) => c.is_completed).length };
  });

  const labelStats = (board.labels ?? [])
    .map((label) => ({ label, count: allCards.filter((c) => c.labels?.some((l) => l.id === label.id)).length }))
    .filter((l) => l.count > 0)
    .sort((a, b) => b.count - a.count);

  const upcomingCards = [...overdue, ...dueSoon].slice(0, 5);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Progreso general */}
        <GeneralProgress completed={completed} total={total} overdue={overdue} dueSoon={dueSoon} rate={rate} />

        {/* Tarjetas por lista */}
        <CardsByList board={board} />

        {/* Miembros */}
        <PanelMembers memberStats={memberStats} />

        {/* Etiquetas */}
        <LabelStats labelStats={labelStats} />

        {/* Fechas límite */}
        <UpcomingCards
          upcomingCards={upcomingCards}
          board={board}
          setSelectedCard={setSelectedCard}
          onOpen={onOpen}
          labelStats={labelStats}
        />
      </div>

      {selectedCard && <CardDetailModal cardId={selectedCard} isOpen={isOpen} onClose={onClose} />}
    </div>
  );
}

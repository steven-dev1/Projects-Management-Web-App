import { BoardResponse } from "@/store/features/boards/BoardsTypes";
import { isPast, isWithinInterval, addDays } from "date-fns";
import { useMemo } from "react";

export function useBoardStats(board: BoardResponse) {
  return useMemo(() => {
    const allCards = board.lists.flatMap((l) => l.cards);
    const allCardsIncludingArchived = board.lists.flatMap((l) => l.cards);
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

    return { allCards, allCardsIncludingArchived, total, completed, rate, overdue, dueSoon, memberStats, labelStats, upcomingCards };
  }, [board]);
}

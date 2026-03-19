import { useAppSelector } from "@/store/hooks";
import { useMemo } from "react";

export function useDashboardStats() {
  const { boards, status } = useAppSelector((s) => s.boards);
  const currentUser = useAppSelector((s) => s.auth.user);

  const allCards = useMemo(
    () => boards.flatMap((b) => (b.lists ?? []).flatMap((l) => l.cards ?? [])),
    [boards]
  );

  const assignedCards = useMemo(
    () => allCards.filter((c) => c.assigned_to === currentUser?.id),
    [allCards, currentUser]
  );

  const upcomingCards = useMemo(() => {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7);
    return allCards.filter((c) => {
      if (!c.due_date || c.is_completed) return false;
      const due = new Date(c.due_date);
      return due >= now && due <= in7Days;
    });
  }, [allCards]);

  return { boards, status, allCards, assignedCards, upcomingCards };
}
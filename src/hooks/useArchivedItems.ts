import { supabase } from "@/lib/supabase";
import { BoardList, Card } from "@/store/features/boards/BoardsTypes";
import { useEffect, useState } from "react";

export function useArchivedItems(boardId: string, isOpen: boolean) {
  const [archivedCards, setArchivedCards] = useState<Card[]>([]);
  const [archivedLists, setArchivedLists] = useState<BoardList[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetch = async () => {
      setLoading(true);
      const [cardsRes, listsRes] = await Promise.all([
        supabase
          .from("cards")
          .select("*, lists!list_id(title)")
          .eq("status", "archived")
          .eq("lists.board_id", boardId)
          .order("updated_at", { ascending: false }),
        supabase
          .from("lists")
          .select("*")
          .eq("status", "archived")
          .eq("board_id", boardId)
          .order("updated_at", { ascending: false }),
      ]);
      if (cardsRes.data) setArchivedCards(cardsRes.data);
      if (listsRes.data) setArchivedLists(listsRes.data);
      setLoading(false);
    };

    fetch();
  }, [isOpen, boardId, ]);

  const removeCard = (cardId: string) =>
    setArchivedCards((prev) => prev.filter((c) => c.id !== cardId));

  const removeList = (listId: string) =>
    setArchivedLists((prev) => prev.filter((l) => l.id !== listId));

  return { archivedCards, archivedLists, loading, removeCard, removeList };
}
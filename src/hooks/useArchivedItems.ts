import { supabase } from "@/lib/supabase";
import useSWR from "swr";

async function fetchArchivedItems(boardId: string) {
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
  return {
    cards: cardsRes.data ?? [],
    lists: listsRes.data ?? [],
  };
}

export function useArchivedItems(boardId: string, isOpen: boolean) {
  const { data, isLoading, mutate } = useSWR(
    isOpen ? `archived-items-${boardId}` : null,
    () => fetchArchivedItems(boardId),
    { revalidateOnFocus: false },
  );

  const removeCard = (cardId: string) => {
    mutate(
      (current) => (current ? { ...current, cards: current.cards.filter((c) => c.id !== cardId) } : current),
      { revalidate: false },
    );
  };

  const removeList = (listId: string) => {
    mutate((current) => (current ? { ...current, lists: current.lists.filter((l) => l.id !== listId) } : current), {
      revalidate: false,
    });
  };

  return {
    archivedCards: data?.cards ?? [],
    archivedLists: data?.lists ?? [],
    loading: isLoading,
    removeCard,
    removeList,
  };
}

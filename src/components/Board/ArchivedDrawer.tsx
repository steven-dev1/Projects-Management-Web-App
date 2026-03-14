import { createClient } from "@/lib/supabaseClient";
import { BoardList, Card } from "@/store/features/boards/BoardsTypes";
import { deleteCard, restoreCard } from "@/store/features/boards/CardsThunks";
import { useAppDispatch } from "@/store/hooks";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, Spinner, Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";
import { ArchivedCardItem } from "./ArchivedCardItem";
import { ArchivedListItem } from "./ArchivedListItem";
import { restoreList } from "@/store/features/boards/ListsThunks";

export const ArchivedDrawer = ({ boardId, isOpen, onClose }: {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<"cards" | "lists">("cards");
  const [archivedCards, setArchivedCards] = useState<Card[]>([]);
  const [archivedLists, setArchivedLists] = useState<BoardList[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

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
  }, [isOpen, boardId, supabase]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1 border-b border-zinc-100">
          <p className="text-base font-semibold">Elementos archivados</p>
        </DrawerHeader>
        <DrawerBody className="p-0">
          <Tabs
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(key as "cards" | "lists")}
            className="px-4 pt-3"
          >
            <Tab key="cards" title="Tarjetas" />
            <Tab key="lists" title="Listas" />
          </Tabs>

          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="sm" />
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-4">
              {selected === "cards" && (
                archivedCards.length === 0
                  ? <p className="text-sm text-zinc-400 text-center py-8">No hay tarjetas archivadas</p>
                  : archivedCards.map((card) => (
                    <ArchivedCardItem
                      key={card.id}
                      card={card}
                      onRestore={() => {
                        dispatch(restoreCard(card.id!));
                        setArchivedCards((prev) => prev.filter((c) => c.id !== card.id));
                      }}
                      onDelete={() => {
                        dispatch(deleteCard(card.id!));
                        setArchivedCards((prev) => prev.filter((c) => c.id !== card.id));
                      }}
                    />
                  ))
              )}
              {selected === "lists" && (
                archivedLists.length === 0
                  ? <p className="text-sm text-zinc-400 text-center py-8">No hay listas archivadas</p>
                  : archivedLists.map((list) => (
                    <ArchivedListItem
                      key={list.id}
                      list={list}
                      onRestore={() => {
                        dispatch(restoreList(list.id));
                        setArchivedLists((prev) => prev.filter((l) => l.id !== list.id));
                      }}
                    />
                  ))
              )}
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
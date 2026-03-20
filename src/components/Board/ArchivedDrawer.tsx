import { deleteCard, restoreCard } from "@/store/features/boards/CardsThunks";
import { useAppDispatch } from "@/store/hooks";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, Spinner, Tab, Tabs } from "@heroui/react";
import { useState } from "react";
import { ArchivedCardItem } from "./ArchivedCardItem";
import { ArchivedListItem } from "./ArchivedListItem";
import { deleteList, restoreList } from "@/store/features/boards/ListsThunks";
import { useArchivedItems } from "@/hooks/useArchivedItems";
import { useCurrentUserRole } from "@/hooks/useUserCurrentRole";

export const ArchivedDrawer = ({
  boardId,
  isOpen,
  onClose,
}: {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<"cards" | "lists">("cards");
  const { archivedCards, archivedLists, loading, removeCard, removeList } = useArchivedItems(boardId, isOpen);
  const { isAdmin } = useCurrentUserRole();

  return (
    <Drawer backdrop="blur" isOpen={isOpen} onClose={onClose} placement="right" size="sm">
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
              {selected === "cards" &&
                (archivedCards.length === 0 ? (
                  <p className="text-sm text-zinc-400 text-center py-8">No hay tarjetas archivadas</p>
                ) : (
                  archivedCards.map((card) => (
                    <ArchivedCardItem
                      key={card.id}
                      card={card}
                      onRestore={() => {
                        dispatch(restoreCard(card.id!));
                        removeCard(card.id!);
                      }}
                      onDelete={() => {
                        dispatch(deleteCard(card.id!));
                        removeCard(card.id!);
                      }}
                    />
                  ))
                ))}
              {selected === "lists" &&
                (archivedLists.length === 0 ? (
                  <p className="text-sm text-zinc-400 text-center py-8">No hay listas archivadas</p>
                ) : (
                  archivedLists.map((list) => (
                    <ArchivedListItem
                      key={list.id}
                      list={list}
                      isAdmin={isAdmin}
                      onRestore={() => {
                        dispatch(restoreList(list.id));
                        removeList(list.id);
                      }}
                      onDelete={() => {
                        dispatch(deleteList(list.id));
                        removeList(list.id);
                      }}
                    />
                  ))
                ))}
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

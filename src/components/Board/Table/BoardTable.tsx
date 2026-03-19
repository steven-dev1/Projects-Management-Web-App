"use client";
import { BoardResponse, Card } from "@/store/features/boards/BoardsTypes";
import { useDisclosure } from "@heroui/react";
import { useState } from "react";
import { CardDetailModal } from "../Cards/CardDetailModal";
import BoardTableRow from "./BoardTableRow";
import BoardTableFilters from "./BoardTableFilters";
import { SortDir, SortKey } from "@/types/app";
import { SortableHeader } from "./SortableHeader";

interface FlatCard extends Card {
  listName: string;
}

export default function BoardTable({ board }: { board: BoardResponse }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCard, setSelectedCardId] = useState<string | null>(null);
  const [filterListId, setFilterListId] = useState<string | null>(null);
  const isBoardClosed = board.status === "archived";

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const flatCards: FlatCard[] = board.lists
    .filter((list) => !filterListId || list.id === filterListId)
    .flatMap((list) =>
      list.cards.map((card) => ({
        ...card,
        listName: list.title,
      })),
    );

  const sortedCards = [...flatCards].sort((a, b) => {
    if (!sortKey) return 0;

    let valA: string | number | boolean | null = null;
    let valB: string | number | boolean | null = null;

    if (sortKey === "title") {
      valA = a.title;
      valB = b.title;
    }
    if (sortKey === "listName") {
      valA = a.listName;
      valB = b.listName;
    }
    if (sortKey === "due_date") {
      valA = a.due_date ?? "";
      valB = b.due_date ?? "";
    }
    if (sortKey === "is_completed") {
      valA = a.is_completed ? 1 : 0;
      valB = b.is_completed ? 1 : 0;
    }
    if (sortKey === "assigned_to") {
      const memberA = board.board_members.find((m) => m.user_id === a.assigned_to);
      const memberB = board.board_members.find((m) => m.user_id === b.assigned_to);
      valA = memberA?.profiles?.full_name ?? "";
      valB = memberB?.profiles?.full_name ?? "";
    }

    if (valA === null || valA === "") return 1;
    if (valB === null || valB === "") return -1;
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const handleOpenCard = (card: Card) => {
    setSelectedCardId(card.id!);
    onOpen();
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col overflow-hidden">
      <BoardTableFilters lists={board.lists} filterListId={filterListId} onFilterChange={setFilterListId} />

      <div className="mt-4 rounded-lg border dark:border-zinc-800 border-zinc-200 overflow-hidden flex-1 overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-150">
            <thead className="sticky top-0 z-10">
              <tr className="bg-zinc-50 border-b dark:bg-zinc-900 dark:border-zinc-800 border-zinc-200 text-zinc-500 dark:text-zinc-200 text-xs uppercase tracking-wide">
                <SortableHeader
                  label="Tarjeta"
                  sortKeyValue="title"
                  setSortDir={setSortDir}
                  setSortKey={setSortKey}
                  sortDir={sortDir}
                  sortKey={sortKey}
                />
                <SortableHeader
                  label="Lista"
                  sortKeyValue="listName"
                  setSortDir={setSortDir}
                  setSortKey={setSortKey}
                  sortDir={sortDir}
                  sortKey={sortKey}
                  className=""
                />
                <SortableHeader
                  label="Asignado"
                  sortKeyValue="assigned_to"
                  setSortDir={setSortDir}
                  setSortKey={setSortKey}
                  sortDir={sortDir}
                  sortKey={sortKey}
                  className="hidden lg:table-cell"
                />
                <SortableHeader
                  label="Fecha límite"
                  sortKeyValue="due_date"
                  setSortDir={setSortDir}
                  setSortKey={setSortKey}
                  sortDir={sortDir}
                  sortKey={sortKey}
                  className="hidden md:table-cell"
                />
                <th className="text-left px-4 py-3 font-medium">Labels</th>
                <SortableHeader
                  label="Estado"
                  sortKeyValue="is_completed"
                  setSortDir={setSortDir}
                  setSortKey={setSortKey}
                  sortDir={sortDir}
                  sortKey={sortKey}
                />
              </tr>
            </thead>
            <tbody>
              {sortedCards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400">
                    No hay tarjetas
                  </td>
                </tr>
              ) : (
                sortedCards.map((card) => (
                  <BoardTableRow
                    key={card.id}
                    card={card}
                    listName={card.listName}
                    members={board.board_members}
                    onOpen={() => handleOpenCard(card)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCard && (
        <CardDetailModal isBoardClosed={isBoardClosed} cardId={selectedCard} isOpen={isOpen} onClose={onClose} />
      )}
    </div>
  );
}

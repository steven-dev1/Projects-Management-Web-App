"use client";
import { BoardResponse } from "@/store/features/boards/BoardsTypes";
import { useDisclosure } from "@heroui/react";
import { useState } from "react";
import { CardDetailModal } from "../Cards/CardDetailModal";
import GeneralProgress from "./GeneralProgress";
import CardsByList from "./CardsByList";
import PanelMembers from "./PanelMembers";
import LabelStats from "./LabelStats";
import UpcomingCards from "./UpcomingCards";
import { useBoardStats } from "@/hooks/useBoardStats";

export default function BoardPanel({ board }: { board: BoardResponse }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const isBoardClosed = board.status === "archived";

  const { total, completed, rate, overdue, dueSoon, memberStats, labelStats, upcomingCards } = useBoardStats(board);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <GeneralProgress completed={completed} total={total} overdue={overdue} dueSoon={dueSoon} rate={rate} />
        <CardsByList board={board} />
        <PanelMembers memberStats={memberStats} />
        <LabelStats labelStats={labelStats} />
        <UpcomingCards
          upcomingCards={upcomingCards}
          board={board}
          setSelectedCard={setSelectedCard}
          onOpen={onOpen}
          labelStats={labelStats}
        />
      </div>

      {selectedCard && (
        <CardDetailModal isBoardClosed={isBoardClosed} cardId={selectedCard} isOpen={isOpen} onClose={onClose} />
      )}
    </div>
  );
}

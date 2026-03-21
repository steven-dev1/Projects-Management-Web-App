import { Divider } from "@heroui/react";
import { Card } from "@/store/features/boards/BoardsTypes";
import { CardAssignee } from "./CardAssignee";
import { CardDetailActions } from "./CardDetailActions";
import { useAppSelector } from "@/store/hooks";

interface Props {
  card: Card;
  onClose: () => void;
}

export const CardDetailSidebar = ({ card, onClose }: Props) => {
  const isBoardClosed = useAppSelector((state) => state.boards.currentBoard?.status === "archived");

  return (
    <div className="md:w-56 bg-zinc-50 dark:bg-zinc-900 dark:text-white p-4 flex flex-col gap-2 border-t md:border-t-0 md:border-l dark:border-zinc-800 border-zinc-100 md:rounded-r-xl">
      <CardAssignee card={card} />
      {!isBoardClosed && (
        <>
          <Divider />
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Acciones</p>
          <CardDetailActions card={card} onClose={onClose} />
        </>
      )}
    </div>
  );
};

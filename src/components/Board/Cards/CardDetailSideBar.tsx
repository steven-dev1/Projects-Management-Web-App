import { Divider } from "@heroui/react";
import { Card } from "@/store/features/boards/BoardsTypes";
import { CardAssignee } from "./CardAssignee";
import { CardDetailActions } from "./CardDetailActions";

interface Props {
  card: Card;
  isBoardClosed: boolean;
  onClose: () => void;
}

export const CardDetailSidebar = ({ card, isBoardClosed, onClose }: Props) => (
  <div className="md:w-56 bg-zinc-50 dark:bg-zinc-900 dark:text-white p-4 flex flex-col gap-2 border-t md:border-t-0 md:border-l dark:border-zinc-800 border-zinc-100 md:rounded-r-xl">
    <CardAssignee isBoardClosed={isBoardClosed} card={card} />
    {!isBoardClosed && (
      <>
        <Divider />
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Acciones</p>
        <CardDetailActions card={card} onClose={onClose} />
      </>
    )}
  </div>
);

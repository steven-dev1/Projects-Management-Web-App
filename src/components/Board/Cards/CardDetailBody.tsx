import { Card } from "@/store/features/boards/BoardsTypes";
import { CardDetailTitle } from "./CardDetailTitle";
import { CardDetailDescription } from "./CardDetailDescription";
import { CardDetailDueDate } from "./CardDetailDueDate";
import { CardLabels } from "./CardLabels";
import { CardChecklists } from "./CheckLists/CardCheckLists";

interface Props {
  card: Card;
  listTitle: string;
}

export const CardDetailBody = ({ card, listTitle }: Props) => {
  return (
    <div className="flex-1 min-w-0 p-4 md:p-6 flex flex-col gap-4 md:gap-6 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-1 pr-6 md:pr-0">
        <p className="text-xs text-zinc-400 dark:text-zinc-300">
          En la lista: <span className="font-medium text-zinc-600 dark:text-white">{listTitle ?? "Sin título"}</span>
        </p>
        <CardDetailTitle card={card} />
      </div>
      <CardDetailDueDate card={card} />
      <CardLabels card={card} />
      <div className="flex flex-col gap-2 w-full">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-300 uppercase tracking-wide">Descripción</p>
        <CardDetailDescription card={card} />
        <CardChecklists card={card} />
      </div>
    </div>
  );
};

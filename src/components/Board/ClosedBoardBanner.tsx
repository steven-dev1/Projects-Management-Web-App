import { Info } from "lucide-react";
import { restoreBoard } from "@/store/features/boards/BoardsThunks";
import { useAppDispatch } from "@/store/hooks";

export const ClosedBoardBanner = ({ boardId }: { boardId: string }) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center justify-center py-4 dark:bg-primary-50 bg-[#dbeafe] px-5">
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-center">
        <Info size={18} className="shrink-0" />
        <p>
          Este tablero está cerrado. Abrelo nuevamente para modificarlo.{" "}
          <button
            className="underline ml-1 hover:text-zinc-600 cursor-pointer shrink-0"
            onClick={() => dispatch(restoreBoard(boardId)).unwrap()}
          >
            Abrir tablero
          </button>
        </p>
      </div>
    </div>
  );
};
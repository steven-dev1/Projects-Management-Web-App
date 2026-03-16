'use client'
import BoardPanel from "@/components/Board/Panel/BoardPanel";
import { useAppSelector } from "@/store/hooks";

export default function PanelPage() {
  const currentBoard = useAppSelector((state) => state.boards.currentBoard);
  
    if (!currentBoard) return null;
  return <BoardPanel board={currentBoard}/>;
}
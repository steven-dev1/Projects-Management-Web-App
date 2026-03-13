'use client'
import BoardTable from "@/components/Board/Table/BoardTable";
import { useAppSelector } from "@/store/hooks";

export default function TablePage() {
  const currentBoard = useAppSelector((state) => state.boards.currentBoard);

  if (!currentBoard) return null;

  return <BoardTable board={currentBoard} />;
}
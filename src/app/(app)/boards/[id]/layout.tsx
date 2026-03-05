'use client';
import BoardHeader from "@/components/Board/BoardHeader";
import SkeletonBoardHeader from "@/components/Board/SkeletonBoardHeader";
import { Board } from "@/store/features/boards/BoardsTypes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const [board, setBoard] = useState<Board>();

  useEffect(() => {
    try {
      const fetchBoard = async () => {
        const response = await fetch(`/api/boards/${id}`);
        const data = await response.json();
        console.log(data);
        setBoard(data);
      };
      fetchBoard();
    } catch (error) {
      console.error(error);
    }
  }, [id]);
  if (!board) return <SkeletonBoardHeader />;
  return (
    <>
      <BoardHeader board={board}/>
      {children}
    </>
  );
}

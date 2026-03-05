"use client";
import { Board } from "@/store/features/boards/BoardsTypes";
import ShareButton from "./ShareButton";
import ViewDropdown from "./ViewDropdown";
import MembersGroup from "./MembersGroup";
import { BoardMembersResponse } from "@/types";

export default function BoardHeader({ board }: { board: Board }) {
  return (
    <div className="flex gap-4 items-center justify-between py-2 px-8 border-b border-zinc-200">
      <div className="flex gap-4 items-center">
        <h1 className="text-lg font-semibold">{board.name}</h1>
        <ViewDropdown boardId={board.id as string}/>
      </div>
      <div className="flex items-center gap-4">
        <ShareButton />
        <MembersGroup members={board.board_members as BoardMembersResponse} />
      </div>
    </div>
  );
}

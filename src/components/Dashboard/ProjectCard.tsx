"use client";
import { Board } from "@/store/features/boards/BoardsTypes";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@heroui/react";
import { Archive, ArchiveRestore, Ellipsis, PenBoxIcon } from "lucide-react";
import Link from "next/link";
import { EditBoardModal } from "./EditBoardModal";
import { useTheme } from "next-themes";
import { resolveListColor } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { archiveBoard, restoreBoard } from "@/store/features/boards/BoardsThunks";

export function ProjectCard({ board }: { board: Board }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { resolvedTheme } = useTheme();
  const dispatch = useAppDispatch();
  const isDark = resolvedTheme === "dark";
  const bgColor = resolveListColor(board.background_color, isDark, true);

  return (
    <>
      <div className="group relative flex flex-col bg-white dark:bg-zinc-900 dark:border-zinc-800 border border-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl overflow-hidden hover:shadow-md">
        <div className="h-1.5 w-full" style={bgColor ? { backgroundColor: bgColor } : undefined} />

        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <Link href={`/boards/${board.id}`} className="min-w-0 flex-1">
              <div className="min-w-0">
                <h2 className="text-base font-semibold truncate text-zinc-800 dark:text-zinc-100 dark:hover:text-zinc-400 hover:text-zinc-500">
                  {board.name}
                </h2>
                {board.description && <p className="text-xs text-zinc-400 mt-0.5 truncate">{board.description}</p>}
              </div>
            </Link>
            <div className="shrink-0" onClick={(e) => e.preventDefault()}>
              <Dropdown className="cursor-pointer">
                <DropdownTrigger>
                  <button className="p-1 cursor-pointer rounded-lg dark:hover:bg-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-600 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all">
                    <Ellipsis size={15} />
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  onAction={(key) => {
                    if (key === "edit") onOpen();
                    if (key === "archive") dispatch(archiveBoard(board.id!));
                    if (key === "restore") dispatch(restoreBoard(board.id!));
                  }}
                >
                  <DropdownItem textValue="Editar" key="edit" startContent={<PenBoxIcon size={14} />}>
                    Editar
                  </DropdownItem>
                  {board.status === "active" ? (
                    <DropdownItem textValue="Archivar" key="archive" startContent={<Archive size={14} />}>
                      Archivar
                    </DropdownItem>
                  ) : (
                    <DropdownItem textValue="Restaurar" key="restore" startContent={<ArchiveRestore size={14} />}>
                      Restaurar
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      <EditBoardModal boardId={board.id as string} isOpen={isOpen} onClose={onClose} />
    </>
  );
}

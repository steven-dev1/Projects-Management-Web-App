"use client";
import ShareButton from "./Invite/ShareButton";
import ViewDropdown from "./ViewDropdown";
import MembersGroup from "./MembersGroup";
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@heroui/dropdown";
import { Button, useDisclosure } from "@heroui/react";
import { Archive, Ellipsis, Info, Trash2, X } from "lucide-react";
import { ArchivedDrawer } from "./ArchivedDrawer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { archiveBoard, deleteBoard, restoreBoard } from "@/store/features/boards/BoardsThunks";
import { useRouter } from "next/navigation";

export default function BoardHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const board = useAppSelector((state) => state.boards.currentBoard);
  const dispatch = useAppDispatch();
  const isClosed = board?.status === "archived";
  const currentUser = useAppSelector((state) => state.auth.user);
  const isOwner = board?.owner_id === currentUser?.id;

  if (!board) return null;

  const handleDelete = async () => {
    await dispatch(deleteBoard(board.id)).unwrap();
    router.push("/dashboard");
  };

  return (
    <>
      {isClosed && (
        <div className="flex items-center justify-center py-4 dark:bg-primary-50 bg-[#dbeafe] px-5">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-center">
            <Info size={18} className="shrink-0" />
            <p>
              Este tablero está cerrado. Abrelo nuevamente para modificarlo.{" "}
              <button
                className="underline ml-1 hover:text-zinc-600 cursor-pointer shrink-0"
                onClick={() => dispatch(restoreBoard(board.id!)).unwrap()}
              >
                Abrir tablero
              </button>
            </p>
          </div>
        </div>
      )}
      <div className="flex gap-2 items-center justify-between py-2 px-4 sm:px-8 border-b dark:border-zinc-800 border-zinc-200">
        <div className="flex gap-2 sm:gap-4 items-center min-w-0">
          <h1 className="text-base sm:text-lg font-semibold truncate max-w-30 sm:max-w-xs">{board.name}</h1>
          <ViewDropdown boardId={board.id as string} />
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {isOwner && <ShareButton boardId={board.id as string} />}
          <MembersGroup members={board.board_members} boardOwnerId={board.owner_id} />
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" size="sm" isIconOnly>
                <Ellipsis size={16} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => {
                if (key === "archived") onOpen();
                if (key === "close") dispatch(archiveBoard(board.id!)).unwrap();
                if (key === "delete") handleDelete();
              }}
            >
              <DropdownSection showDivider>
                <DropdownItem key="archived" startContent={<Archive size={14} />}>
                  Elementos archivados
                </DropdownItem>
              </DropdownSection>
              <DropdownSection>
                {board.status === "active" ? (
                  <DropdownItem key="close" startContent={<X size={14} />}>
                    Cerrar tablero
                  </DropdownItem>
                ) : (
                  <DropdownItem key="delete" startContent={<Trash2 size={14} />}>
                    Eliminar tablero definitivamente
                  </DropdownItem>
                )}
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <ArchivedDrawer boardId={board.id as string} isOpen={isOpen} onClose={onClose} />
    </>
  );
}

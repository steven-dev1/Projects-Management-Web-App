"use client";
import ShareButton from "./Invite/ShareButton";
import ViewDropdown from "./ViewDropdown";
import MembersGroup from "./MembersGroup";
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@heroui/dropdown";
import { Button, useDisclosure } from "@heroui/react";
import { Archive, Ellipsis,Trash2, X } from "lucide-react";
import { ArchivedDrawer } from "./ArchivedDrawer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { archiveBoard, deleteBoard } from "@/store/features/boards/BoardsThunks";
import { useRouter } from "next/navigation";
import { ClosedBoardBanner } from "./ClosedBoardBanner";
import { useCurrentUserRole } from "@/hooks/useUserCurrentRole";

export default function BoardHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const board = useAppSelector((state) => state.boards.currentBoard);
  const isClosed = board?.status === "archived";
  const { isOwner } = useCurrentUserRole();

  if (!board) return null;

  const handleDelete = async () => {
    await dispatch(deleteBoard(board.id)).unwrap();
    router.push("/dashboard");
  };

  return (
    <>
      {isClosed && <ClosedBoardBanner boardId={board.id} />}
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

"use client";
import { BoardResponse } from "@/store/features/boards/BoardsTypes";
import ShareButton from "./Invite/ShareButton";
import ViewDropdown from "./ViewDropdown";
import MembersGroup from "./MembersGroup";
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@heroui/dropdown";
import { Button, useDisclosure } from "@heroui/react";
import { Archive, Ellipsis, Trash2, X } from "lucide-react";
import { ArchivedDrawer } from "./ArchivedDrawer";
import { useAppSelector } from "@/store/hooks";

export default function BoardHeader({ board }: { board: BoardResponse }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useAppSelector((state) => state.auth.user);
  const isOwner = board.owner_id === currentUser?.id;
  return (
    <>
      <div className="flex gap-4 items-center justify-between py-2 px-8 border-b border-zinc-200">
        <div className="flex gap-4 items-center">
          <h1 className="text-lg font-semibold">{board.name}</h1>
          <ViewDropdown boardId={board.id as string} />
        </div>
        <div className="flex items-center gap-4">
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

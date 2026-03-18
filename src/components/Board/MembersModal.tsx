"use client";
import { removeMember, updateMemberRole } from "@/store/features/boards/MembersThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { BoardMember, BoardMembersResponse } from "@/types";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { Crown, MoreHorizontal, Trash2, UserCheck, UserX } from "lucide-react";
import ShareButton from "./Invite/ShareButton";

export default function MembersModal({
  isOpen,
  onClose,
  members,
  isAdmin,
  boardOwnerId,
}: {
  isOpen: boolean;
  onClose: () => void;
  members: BoardMembersResponse;
  isAdmin: boolean;
  boardOwnerId: string;
}) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const boardId = useAppSelector((state) => state.boards.currentBoard?.id);

  const handleRemove = async (member: BoardMember) => {
    await dispatch(removeMember({ memberId: member.id })).unwrap();
  };

  const handleRoleChange = async (member: BoardMember, role: "admin" | "member") => {
    await dispatch(updateMemberRole({ memberId: member.id, role })).unwrap();
  };

  return (
    <Modal backdrop="blur" classNames={{
      closeButton:"top-2 right-2 cursor-pointer"
    }} isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col items-start justify-between">
          <span>Miembros del board</span>
          <span className="text-xs text-zinc-400 font-normal">{members.length} participantes</span>
        </ModalHeader>
        <ModalBody className="pb-6">
          <div className="flex flex-col gap-2">
            {members.map((member: BoardMember) => {
              const isOwner = member.user_id === boardOwnerId;
              const isCurrentUser = member.user_id === currentUser?.id;

              return (
                <div key={member.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={member.profiles?.avatar_url ?? undefined}
                      name={member.profiles?.full_name ?? "U"}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-300">
                        {member.profiles?.full_name}
                        {isCurrentUser && (
                          <span className="text-xs text-zinc-400 ml-1">(tú)</span>
                        )}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {isOwner && <Crown size={10} className="text-amber-500" />}
                        <Chip
                          size="sm"
                          variant="flat"
                          color={member.role === "admin" ? "warning" : "default"}
                          className="text-[10px] h-4"
                        >
                          {member.role === "admin" ? "Admin" : "Miembro"}
                        </Chip>
                      </div>
                    </div>
                  </div>
                  {isAdmin && !isOwner && !isCurrentUser && (
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <MoreHorizontal size={14} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="role"
                          startContent={member.role === "admin" ? <UserX size={14} /> : <UserCheck size={14} />}
                          onPress={() =>
                            handleRoleChange(member, member.role === "admin" ? "member" : "admin")
                          }
                        >
                          {member.role === "admin" ? "Cambiar a miembro" : "Hacer admin"}
                        </DropdownItem>
                        <DropdownItem
                          key="remove"
                          className="text-danger"
                          color="danger"
                          startContent={<Trash2 size={14} />}
                          onPress={() => handleRemove(member)}
                        >
                          Eliminar del board
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </div>
              );
            })}
          </div>

          {isAdmin && boardId && (
            <>
              <Divider className="my-2" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500 dark:text-zinc-300">Invitar nuevo miembro</p>
                <ShareButton boardId={boardId} />
              </div>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
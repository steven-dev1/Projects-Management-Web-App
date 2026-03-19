"use client";
import { Avatar, AvatarGroup, useDisclosure } from "@heroui/react";
import { BoardMembersResponse } from "@/types";
import MembersModal from "./MembersModal";

export default function MembersGroup({
  members
}: {
  members: BoardMembersResponse;
  boardOwnerId: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <AvatarGroup
        renderCount={(count) => (
          <p className="text-small text-foreground font-medium ms-2">+{count} más</p>
        )}
        size="sm"
        max={3}
        className="cursor-pointer"
        onClick={onOpen}
      >
        {members.map((member) => (
          <Avatar
            key={member.id}
            isBordered
            size="sm"
            src={member.profiles?.avatar_url ?? undefined}
            name={member.profiles?.full_name ?? ""}
          />
        ))}
      </AvatarGroup>

      <MembersModal
        isOpen={isOpen}
        onClose={onClose}
        members={members}
      />
    </>
  );
}
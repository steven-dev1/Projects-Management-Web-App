import { BoardMembersResponse } from "@/types";
import { Avatar, AvatarGroup } from "@heroui/avatar";

export default function MembersGroup({ members }: { members: BoardMembersResponse }) {
  return (
    <AvatarGroup
      renderCount={(count) => <p className="text-small text-foreground font-medium ms-2">+{count} others</p>}
      size="sm"
      max={3}
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
  );
}

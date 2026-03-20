import { useAppSelector } from "@/store/hooks";
import { Avatar, Tooltip } from "@heroui/react";

export const AssignedAvatar = ({ userId }: { userId: string }) => {
  const members = useAppSelector((state) => state.boards.currentBoard?.board_members ?? []);
  const member = members.find((m) => m.user_id === userId);

  if (!member) return null;

  return (
    <Tooltip closeDelay={0} size="sm" content={`Asignado a ${member.profiles?.full_name}`} showArrow placement="bottom">
      <Avatar
        src={member.profiles?.avatar_url ?? undefined}
        name={member.profiles?.full_name ?? "U"}
        size="sm"
        className="w-4 h-4"
      />
    </Tooltip>
  );
};
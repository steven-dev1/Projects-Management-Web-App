import { memo } from "react";
import { Avatar } from "@heroui/avatar";
import { useAppSelector } from "@/store/hooks";
import { selectAvatarUrl } from "@/hooks/selectors";

export const UserAvatar = memo(function UserAvatar({
  size = "sm",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const avatarUrl = useAppSelector(selectAvatarUrl);
  const fullName = useAppSelector(
    (state) => state.auth.profile?.full_name ?? "Usuario",
  );

  return (
    <Avatar
      src={avatarUrl || undefined}
      name={fullName}
      size={size}
      className={className}
      isBordered
      radius="full"
      color="default"
      showFallback
      imgProps={{
        loading: "lazy",
        decoding: "async",
        referrerPolicy: "no-referrer",
      }}
    />
  );
});

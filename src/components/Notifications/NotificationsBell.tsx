"use client";
import { useDispatch, useSelector } from "react-redux";
import { Bell, Check, CheckCircle2 } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Badge } from "@heroui/react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AppDispatch, RootState } from "@/store/store";
import { AppNotification } from "@/types";
import { markAllAsRead, markAsRead } from "@/store/features/notifications/notificationsThunks";
import { acceptBoardInvitation } from "@/lib/actions/acceptBoardInvitation";

export default function NotificationsBell() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleClick = (notification: AppNotification) => {
    if (!notification.is_read) {
      dispatch(markAsRead(notification.id));
    }
    if (notification.url) {
      router.push(notification.url);
    }
  };

  const handleAcceptInvitation = async (notification: AppNotification) => {
    const boardId = getBoardIdFromUrl(notification.url!);
    console.log("BoardId", boardId);
    if (notification.type !== "board_invited" || !boardId) return;
    try {
      await dispatch(markAsRead(notification.id));
      await acceptBoardInvitation({
        boardId,
        userId: notification.user_id,
        memberRole: notification.role,
      });
      router.push(`/boards/${boardId}`);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const getBoardIdFromUrl = (url: string) => {
    const match = url.match(/\/boards\/([a-zA-Z0-9-]+)/);
    return match?.[1] ?? null;
  };

  return (
    <Dropdown suppressHydrationWarning placement="bottom-end">
      <DropdownTrigger>
        <Button id="notifications-bell-btn" isIconOnly variant="light" className="relative">
          <Badge
            content={unreadCount > 0 ? unreadCount : null}
            color="danger"
            size="sm"
            isInvisible={unreadCount === 0}
          >
            <Bell size={20} />
          </Badge>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Notificaciones"
        className="w-96 max-h-96 overflow-y-auto"
        emptyContent="No tienes notificaciones"
      >
        <>
          {unreadCount > 0 && (
            <DropdownItem key="mark-all" className="text-primary text-xs" onPress={() => dispatch(markAllAsRead())}>
              Marcar todas como leídas
            </DropdownItem>
          )}
          {notifications.map((n) => (
            <DropdownItem
              key={n.id}
              onPress={() => handleClick(n)}
              className={!n.is_read ? "bg-primary-50 dark:hover:bg-primary-50/50 my-1" : ""}
              classNames={{
                description: "dark:group-hover:text-zinc-400",
              }}
              description={formatDistanceToNow(new Date(n.created_at), {
                addSuffix: true,
                locale: es,
              })}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{n.title}</span>
                <span className="text-xs text-default-500">{n.message}</span>

                {n.type === "board_invited" && !n.is_read ? (
                  <Button
                    onPress={() => handleAcceptInvitation(n)}
                    className="my-2"
                    variant="flat"
                    size="sm"
                    startContent={<CheckCircle2 size={14} />}
                  >
                    Aceptar invitación
                  </Button>
                ) : <span className="my-1 text-xs justify-end flex items-center gap-1 dark:text-zinc-400"><Check size={14}/> Invitación aceptada</span>}
              </div>
            </DropdownItem>
          ))}
        </>
      </DropdownMenu>
    </Dropdown>
  );
}

"use client";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Badge } from "@heroui/react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AppDispatch, RootState } from "@/store/store";
import { AppNotification } from "@/types";
import { markAllAsRead, markAsRead } from "@/store/features/notifications/notificationsThunks";

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

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button isIconOnly variant="light" className="relative">
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
              className={!n.is_read ? "bg-primary-50 my-1" : ""}
              description={formatDistanceToNow(new Date(n.created_at), {
                addSuffix: true,
                locale: es,
              })}
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">{n.title}</span>
                <span className="text-xs text-default-500">{n.message}</span>
              </div>
            </DropdownItem>
          ))}
        </>
      </DropdownMenu>
    </Dropdown>
  );
}

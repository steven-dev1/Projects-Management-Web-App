"use client";
import { useDispatch } from "react-redux";
import {Bell} from '@gravity-ui/icons';
import { Check, CheckCircle2 } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Badge } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AppDispatch } from "@/store/store";
import { markAllAsRead } from "@/store/features/notifications/notificationsThunks";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsBell() {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount, handleClick, handleAcceptInvitation } = useNotifications();

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
            <Bell />
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
            <DropdownItem textValue="Marcar leidas" key="mark-all" className="text-primary text-xs" onPress={() => dispatch(markAllAsRead())}>
              Marcar todas como leídas
            </DropdownItem>
          )}
          {notifications.map((n) => (
            <DropdownItem
              textValue={n.title}
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

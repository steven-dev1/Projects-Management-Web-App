import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import { AppNotification } from "@/types";
import { markAsRead } from "@/store/features/notifications/notificationsThunks";
import { acceptBoardInvitation } from "@/lib/actions/acceptBoardInvitation";

export function useNotifications() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getBoardIdFromUrl = (url: string) => {
    const match = url.match(/\/boards\/([a-zA-Z0-9-]+)/);
    return match?.[1] ?? null;
  };

  const handleClick = (notification: AppNotification) => {
    if (!notification.is_read) dispatch(markAsRead(notification.id));
    if (notification.url) router.push(notification.url);
  };

  const handleAcceptInvitation = async (notification: AppNotification) => {
    const boardId = getBoardIdFromUrl(notification.url!);
    if (notification.type !== "board_invited" || !boardId) return;
    try {
      await dispatch(markAsRead(notification.id));
      await acceptBoardInvitation({ boardId, userId: notification.user_id, memberRole: notification.role });
      router.push(`/boards/${boardId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return { notifications, unreadCount, handleClick, handleAcceptInvitation };
}

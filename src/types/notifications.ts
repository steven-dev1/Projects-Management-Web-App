export type NotificationType = "card_assigned" | "board_invited" | "card_commented" | "card_due";

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  url?: string;
  is_read: boolean;
  role?: "admin" | "member";
  created_at: string;
}
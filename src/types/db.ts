import { Card } from "@/store/features/boards/BoardsTypes"

export type Theme = "light" | "dark" | "system"

export interface Preferences {
  theme?: Theme
  language?: string
  timezone?: string
  emailNotifications?: boolean
}

export interface PasswordResetData {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface BoardMember {
  board_id: string;
  id: string;
  user_id: string;
  role: "admin" | "member";
  created_at: string;
  updated_at: string;
  profiles: Profile;
}
export type BoardMembersResponse = BoardMember[]

export type Profile = {
  full_name?: string;
  avatar_url?: string | null;
};

export interface Label {
  id: string;
  board_id: string;
  name: string | null;
  color: string;
  created_at: string;
}

export interface CardLabel {
  card_id: string;
  label_id: string;
}

export type CardWithLabels = Card & {
  card_labels?: {
    label_id: string;
    labels: Label;
  }[];
};

export interface ChecklistItem {
  id: string;
  checklist_id: string;
  title: string;
  is_completed: boolean;
  position: number;
  created_at?: string;
  updated_at?: string;
}

export interface Checklist {
  id: string;
  card_id: string;
  title: string;
  position: number;
  items: ChecklistItem[];
  created_at?: string;
  updated_at?: string;
}


export type NotificationType = 'card_assigned' | 'board_invited' | 'card_commented' | 'card_due';

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
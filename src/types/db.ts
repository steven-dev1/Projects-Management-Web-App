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
  role: "admin" | "member"; // puedes ampliarlo si manejas más roles
  created_at: string;
  updated_at: string;
  profiles: Profile;
}

export type Profile = {
  full_name?: string;
  avatar_url?: string | null;
};

export type BoardMembersResponse = BoardMember[]
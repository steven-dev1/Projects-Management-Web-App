import { User } from "@supabase/supabase-js";
import { Preferences, Profile } from "./db";
import { Board } from "@/store/features/boards/BoardsTypes";

export interface ProfileUpdate {
  full_name?: string
}

export interface PreferencesUpdate {
  language?: string
  timezone?: string
}

export interface BoardsState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  preferences: Preferences | null;
}

export interface UpdateUserProfileData {
  full_name?: string;
  language?: string;
  timezone?: string;
}
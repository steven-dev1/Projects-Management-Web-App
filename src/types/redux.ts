import { User } from "@supabase/supabase-js";
import { Preferences, Profile } from "./db";

export interface ProfileUpdate {
  full_name?: string
}

export interface PreferencesUpdate {
  language?: string
  timezone?: string
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
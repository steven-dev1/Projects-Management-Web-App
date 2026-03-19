import { RootState } from "@/store/store";

export const selectUser = (state: RootState) => state.auth.user;
export const selectProfile = (state: RootState) => state.auth.profile;
export const selectPreferences = (state: RootState) => state.auth.preferences;
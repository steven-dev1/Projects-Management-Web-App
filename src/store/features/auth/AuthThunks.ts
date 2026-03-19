import { handleThunkError } from "@/lib/handleThunkError";
import { authService } from "@/services/authService";
import { RootState } from "@/store/store";
import { PreferencesUpdate, ProfileUpdate, UpdateUserProfileData } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserAndProfile = createAsyncThunk("auth/fetchUserAndProfile", async (_, { rejectWithValue }) => {
  try {
    const {
      data: { session },
    } = await authService.getSession();
    const user = session?.user ?? null;
    if (!user) return { user: null, profile: null };

    const { data: profile, error } = await authService.getProfile(user.id);
    if (error) throw error;

    let avatarUrl: string | null = null;
    if (profile?.avatar_url) {
      const isFullUrl = profile.avatar_url.startsWith("http");
      if (isFullUrl) {
        avatarUrl = profile.avatar_url.split("?")[0];
      } else {
        const { data } = authService.getPublicAvatarUrl(profile.avatar_url);
        avatarUrl = data.publicUrl;
      }
    }

    const { data: preferences, error: preferencesError } = await authService.getPreferences(user.id);
    if (preferencesError) throw preferencesError;

    return { user, profile: { ...profile, avatar_url: avatarUrl }, preferences };
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error al obtener el usuario"));
  }
});

export const refreshAvatarUrl = createAsyncThunk<
  { avatar_url: string | null },
  void,
  { state: RootState; rejectValue: string }
>("auth/refreshAvatarUrl", async (_, { getState, rejectWithValue }) => {
  try {
    const userId = getState().auth.user?.id;
    if (!userId) return rejectWithValue("No hay usuario autenticado");

    const { data: profile, error } = await authService.getAvatarUrl(userId);
    if (error) throw error;

    const avatar_url = profile?.avatar_url ? `${profile.avatar_url.split("?")[0]}?t=${Date.now()}` : null;

    return { avatar_url };
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error al refrescar avatar"));
  }
});

export const updateUserData = createAsyncThunk<
  { profile?: ProfileUpdate; preferences?: PreferencesUpdate },
  UpdateUserProfileData,
  { state: RootState; rejectValue: string }
>("auth/updateUserData", async (data, { getState, rejectWithValue }) => {
  const userId = getState().auth.user?.id;
  if (!userId) return rejectWithValue("Usuario no autenticado");

  try {
    const updates: { profile?: ProfileUpdate; preferences?: PreferencesUpdate } = {};

    if (data.language || data.timezone) {
      const preferencesData: Partial<PreferencesUpdate> = {};
      if (data.language) preferencesData.language = data.language;
      if (data.timezone) preferencesData.timezone = data.timezone;
      const { error } = await authService.updatePreferences(userId, preferencesData);
      if (error) throw error;
      updates.preferences = preferencesData;
    }

    if (data.full_name) {
      const { error } = await authService.updateProfile(userId, { full_name: data.full_name });
      if (error) throw error;
      updates.profile = { full_name: data.full_name.trim() };
    }

    return updates;
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error desconocido al actualizar perfil"));
  }
});

import { createClient } from "@/lib/supabaseClient";
import { RootState } from "@/store/store";
import { PreferencesUpdate, ProfileUpdate, UpdateUserProfileData } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

const supabase = createClient();

export const fetchUserAndProfile = createAsyncThunk("auth/fetchUserAndProfile", async (_, { rejectWithValue }) => {
  try {
    console.trace("fetchUserAndProfile llamado desde:");
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user ?? null;

    if (!user) {
      return { user: null, profile: null };
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) throw error;

    let avatarUrl: string | null = null;

    if (profile?.avatar_url) {
      const isFullUrl = profile.avatar_url.startsWith("http");

      if (isFullUrl) {
        avatarUrl = profile.avatar_url.split("?")[0];
      } else {
        const { data } = supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);
        avatarUrl = data.publicUrl;
      }
    }

    const { data: preferences, error: preferencesError } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("id", user.id)
      .single();

    if (preferencesError) {
      throw preferencesError;
    }
    return {
      user,
      profile: {
        ...profile,
        avatar_url: avatarUrl,
      },
      preferences,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    return rejectWithValue(message);
  }
});

export const refreshAvatarUrl = createAsyncThunk<
  { avatar_url: string | null },
  void,
  { state: RootState; rejectValue: string }
>("auth/refreshAvatarUrl", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const userId = auth.user?.id;

    if (!userId) return rejectWithValue("No hay usuario autenticado");

    const { data: profile, error } = await supabase.from("profiles").select("avatar_url").eq("id", userId).single();

    if (error) throw error;

    // La URL ya viene completa desde la DB, solo agregamos el timestamp
    const avatar_url = profile?.avatar_url
      ? `${profile.avatar_url.split("?")[0]}?t=${Date.now()}` // ← split para evitar timestamps duplicados
      : null;

    return { avatar_url };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al refrescar avatar";
    return rejectWithValue(message);
  }
});

export const updateUserData = createAsyncThunk<
  { profile?: ProfileUpdate; preferences?: PreferencesUpdate },
  UpdateUserProfileData,
  { state: RootState; rejectValue: string }
>("auth/updateUserData", async (data, { getState, rejectWithValue }) => {
  const { auth } = getState();

  const userId = auth.user?.id;

  if (!userId) {
    return rejectWithValue("Usuario no autenticado");
  }

  try {
    const updates: {
      profile?: ProfileUpdate;
      preferences?: PreferencesUpdate;
    } = {};

    if (data.language || data.timezone) {
      const preferencesData: Partial<PreferencesUpdate> = {};
      if (data.language) preferencesData.language = data.language;
      if (data.timezone) preferencesData.timezone = data.timezone;

      const { error: prefError } = await supabase.from("user_preferences").update(preferencesData).eq("id", userId);

      if (prefError) throw prefError;

      updates.preferences = preferencesData;
    }

    if (data.full_name) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: data.full_name.trim() })
        .eq("id", userId);

      if (profileError) throw profileError;

      updates.profile = { full_name: data.full_name.trim() };
    }

    return updates;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido al actualizar perfil";
    return rejectWithValue(message);
  }
});

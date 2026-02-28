// store/slices/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createClient } from "@/lib/supabaseClient";
import {
  AuthState,
  PreferencesUpdate,
  ProfileUpdate,
  UpdateUserProfileData,
} from "@/types/redux";
import { RootState } from "../store";

const supabase = createClient();

const initialState: AuthState = {
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  preferences: null,
};

export const fetchUserAndProfile = createAsyncThunk(
  "auth/fetchUserAndProfile",
  async (_, { rejectWithValue }) => {
    try {
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
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(profile.avatar_url);

        avatarUrl = `${data.publicUrl}?t=${Date.now()}`;
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
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      return rejectWithValue(message);
    }
  },
);

export const updateUserData = createAsyncThunk<
  { profile?: ProfileUpdate; preferences?: PreferencesUpdate },
  UpdateUserProfileData,
  { state: RootState; rejectValue: string }
>("auth/updateUserData", async (data, { getState, rejectWithValue }) => {
  const supabase = createClient();
  const { auth } = getState();

  // Mejor usar el user que ya tienes en el estado
  const userId = auth.user?.id;

  if (!userId) {
    return rejectWithValue("Usuario no autenticado");
  }

  try {
    const updates: {
      profile?: ProfileUpdate;
      preferences?: PreferencesUpdate;
    } = {};

    // 1. Actualizar preferences (tabla user_preferences)
    if (data.language || data.timezone) {
      const preferencesData: Partial<PreferencesUpdate> = {};
      if (data.language) preferencesData.language = data.language;
      if (data.timezone) preferencesData.timezone = data.timezone;

      const { error: prefError } = await supabase
        .from("user_preferences")
        .update(preferencesData)
        .eq("id", userId);

      if (prefError) throw prefError;

      updates.preferences = preferencesData;
    }

    // 2. Actualizar profile (solo si viene full_name)
    if (data.full_name) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: data.full_name.trim() })
        .eq("id", userId);

      if (profileError) throw profileError;

      updates.profile = { full_name: data.full_name.trim() };
    }

    // Retornamos solo lo que se actualizó
    return updates;
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Error desconocido al actualizar perfil";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAndProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserAndProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.preferences = action.payload.preferences;
        state.isLoading = false;
      })
      .addCase(fetchUserAndProfile.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      //   UPDATE
      .addCase(updateUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateUserData.fulfilled,
        (
          state,
          action: PayloadAction<{
            profile?: ProfileUpdate;
            preferences?: PreferencesUpdate;
          }>,
        ) => {
          state.isLoading = false;

          if (
            action.payload.profile?.full_name &&
            action.payload.profile.full_name !== state.profile?.full_name
          ) {
            if (state.profile) {
              state.profile.full_name = action.payload.profile.full_name; // muta directamente (RTK lo permite)
            } else {
              state.profile = { full_name: action.payload.profile.full_name };
            }
          }

          if (action.payload.preferences) {
            if (!state.preferences)
              state.preferences = {
                language: "es",
                timezone: "America/Bogota",
              };

            if (
              action.payload.preferences.language &&
              action.payload.preferences.language !== state.preferences.language
            ) {
              state.preferences.language = action.payload.preferences.language;
            }
            if (
              action.payload.preferences.timezone &&
              action.payload.preferences.timezone !== state.preferences.timezone
            ) {
              state.preferences.timezone = action.payload.preferences.timezone;
            }
          }
        },
      )
      .addCase(updateUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Error al actualizar datos";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

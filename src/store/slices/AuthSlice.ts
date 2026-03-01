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

      const { error: prefError } = await supabase
        .from("user_preferences")
        .update(preferencesData)
        .eq("id", userId);

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
    const message =
      err instanceof Error
        ? err.message
        : "Error desconocido al actualizar perfil";
    return rejectWithValue(message);
  }
});

// REFRESCAR AVATAR SOLAMENTE
export const refreshAvatarUrl = createAsyncThunk<
  { avatar_url: string | null }, // lo que retorna (éxito)
  void, // no recibe argumentos
  { state: RootState; rejectValue: string }
>("auth/refreshAvatarUrl", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const userId = auth.user?.id;

    if (!userId) {
      return rejectWithValue("No hay usuario autenticado");
    }

    // 1. Obtener el avatar_url actual de la tabla profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;
    if (!profile?.avatar_url) {
      return { avatar_url: null };
    }

    // 2. Obtener la URL pública actualizada
    const { data: storageData } = supabase.storage
      .from("avatars")
      .getPublicUrl(profile.avatar_url);

    // Opcional: agregar timestamp solo aquí para forzar refresh visual
    // Puedes quitarlo si prefieres que el navegador cachee agresivamente
    const freshAvatarUrl = storageData.publicUrl
      ? `${storageData.publicUrl}?t=${Date.now()}`
      : null;

    // 3. Retornamos solo lo necesario
    return { avatar_url: freshAvatarUrl };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Error al refrescar avatar";
    console.error("refreshAvatarUrl error:", err);
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
              state.profile.full_name = action.payload.profile.full_name;
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
      })

      // REFRESCAR AVATAR
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .addCase(refreshAvatarUrl.pending, (state) => {
      // Opcional: podrías poner un mini-loading solo para avatar
      // state.avatarLoading = true;
    })
    .addCase(refreshAvatarUrl.fulfilled, (state, action) => {
      if (state.profile) {
        state.profile.avatar_url = action.payload.avatar_url;
      }
      // state.avatarLoading = false; // si usaste loading específico
    })
    .addCase(refreshAvatarUrl.rejected, (state, action) => {
      // state.avatarLoading = false;
      state.error = action.payload ?? "Error refrescando avatar";
      console.warn("Refresh avatar falló:", action.payload);
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

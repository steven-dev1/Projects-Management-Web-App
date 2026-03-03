import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, PreferencesUpdate, ProfileUpdate } from "@/types/redux";
import { fetchUserAndProfile, refreshAvatarUrl, updateUserData } from "./AuthThunks";

const initialState: AuthState = {
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  preferences: null,
};

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

          if (action.payload.profile?.full_name && action.payload.profile.full_name !== state.profile?.full_name) {
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

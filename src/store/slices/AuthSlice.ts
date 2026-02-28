// store/slices/authSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { createClient } from "@/lib/supabaseClient"
import type { User } from "@supabase/supabase-js"

const supabase = createClient()

type Profile = {
  full_name?: string
  avatar_url?: string | null
}

interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  profile: null,
  isLoading: true,
  error: null,
}

export const fetchUserAndProfile = createAsyncThunk(
  "auth/fetchUserAndProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user ?? null

      if (!user) {
        return { user: null, profile: null }
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single()

      if (error) throw error

      let avatarUrl: string | null = null

      if (profile?.avatar_url) {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(profile.avatar_url)

        avatarUrl = data.publicUrl
      }

      return {
        user,
        profile: {
          ...profile,
          avatar_url: avatarUrl,
        },
      }

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred"
      return rejectWithValue(message)
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.profile = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAndProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUserAndProfile.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.profile = action.payload.profile
        state.isLoading = false
      })
      .addCase(fetchUserAndProfile.rejected, (state, action) => {
        state.error = action.payload as string
        state.isLoading = false
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
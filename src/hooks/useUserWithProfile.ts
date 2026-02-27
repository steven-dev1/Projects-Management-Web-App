"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabaseClient"
import type { User } from "@supabase/supabase-js"

type Profile = {
  username?: string
  full_name?: string
  avatar_url?: string
  // ...
}

type UserWithProfile = {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  error?: Error | null
}

export function useUserWithProfile() {
  const supabase = createClient()

  const [state, setState] = useState<UserWithProfile>({
    user: null,
    profile: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user ?? null

        if (!user) {
          if (mounted) setState({ user: null, profile: null, isLoading: false })
          return
        }

        // Fetch profile
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single()

        if (mounted) {
          setState({
            user,
            profile: error ? null : profile,
            isLoading: false,
            error: error ?? null,
          })
        }
      } catch (err) {
        if (mounted) {
          setState(s => ({ ...s, isLoading: false, error: err as Error }))
        }
      }
    }

    load()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      const user = session?.user ?? null

      if (!user) {
        setState({ user: null, profile: null, isLoading: false })
        return
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single()

      setState({
        user,
        profile: error ? null : profile,
        isLoading: false,
        error: error ?? null,
      })
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  return useMemo(() => state, [state])
}
import { createSelector } from 'reselect'
import type { RootState } from '@/store/store'

export const selectAvatarUrl = createSelector(
  (state: RootState) => state.auth.profile,
  (profile) => profile?.avatar_url ?? null
)

export const selectFullName = createSelector(
  (state: RootState) => state.auth.profile,
  profile => profile?.full_name ?? 'Usuario'
)
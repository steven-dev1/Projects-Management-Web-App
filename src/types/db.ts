export type Theme = "light" | "dark" | "system"

export interface Preferences {
  theme?: Theme
  language?: string
  timezone?: string
  emailNotifications?: boolean
}

export interface PasswordResetData {
  current_password: string
  new_password: string
  confirm_password: string
}
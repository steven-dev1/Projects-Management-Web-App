export type Theme = "light" | "dark" | "system"

export interface Preferences {
  theme?: Theme
  language?: string
  timezone?: string
  emailNotifications?: boolean
}
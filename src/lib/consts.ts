export const TOP_TIMEZONES = [
  "America/New_York",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/Argentina/Buenos_Aires",
  "America/Bogota",
  "Europe/Madrid",
  "Europe/London",
]

export const FILTER_OPTIONS_BOARDS = [
  { label: "A-Z", value: "a-z" },
  { label: "Z-A", value: "z-a" },
  { label: "Creado recientemente", value: "recent" },
  { label: "Creado más antiguo", value: "oldest" },
  // { label: "Creado por mi", value: "mine" },
  // { label: "Creado por otro", value: "others" },
  // { label: "Vistos recientemente", value: "recent-view" },
]

export const LIST_COLORS = [
  { id: "zinc",     label: "Zinc",     light: "#f4f4f5", dark: "color-mix(in oklab, #71717a 15%, transparent)", board: "#52525b" },
  { id: "rojo",     label: "Rojo",     light: "#fee2e2", dark: "color-mix(in oklab, #f87171 15%, transparent)", board: "#ef4444" },
  { id: "naranja",  label: "Naranja",  light: "#ffedd5", dark: "color-mix(in oklab, #fb923c 15%, transparent)", board: "#f97316" },
  { id: "amarillo", label: "Amarillo", light: "#fef9c3", dark: "color-mix(in oklab, #facc15 15%, transparent)", board: "#eab308" },
  { id: "verde",    label: "Verde",    light: "#dcfce7", dark: "color-mix(in oklab, #4ade80 15%, transparent)", board: "#22c55e" },
  { id: "cyan",     label: "Cyan",     light: "#cffafe", dark: "color-mix(in oklab, #22d3ee 15%, transparent)", board: "#06b6d4" },
  { id: "azul",     label: "Azul",     light: "#dbeafe", dark: "color-mix(in oklab, #60a5fa 15%, transparent)", board: "#3b82f6" },
  { id: "violeta",  label: "Violeta",  light: "#ede9fe", dark: "color-mix(in oklab, #a78bfa 15%, transparent)", board: "#8b5cf6" },
  { id: "rosa",     label: "Rosa",     light: "#fce7f3", dark: "color-mix(in oklab, #f472b6 15%, transparent)", board: "#ec4899" },
  { id: "piedra",   label: "Piedra",   light: "#f5f5f4", dark: "color-mix(in oklab, #a8a29e 15%, transparent)", board: "#78716c" },
] as const;
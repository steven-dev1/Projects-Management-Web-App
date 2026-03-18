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
  { id: "zinc",     label: "Zinc",     light: "#f4f4f5", dark: "color-mix(in oklab, #71717a 15%, transparent)" },
  { id: "rojo",     label: "Rojo",     light: "#fee2e2", dark: "color-mix(in oklab, #f87171 15%, transparent)" },
  { id: "naranja",  label: "Naranja",  light: "#ffedd5", dark: "color-mix(in oklab, #fb923c 15%, transparent)" },
  { id: "amarillo", label: "Amarillo", light: "#fef9c3", dark: "color-mix(in oklab, #facc15 15%, transparent)" },
  { id: "verde",    label: "Verde",    light: "#dcfce7", dark: "color-mix(in oklab, #4ade80 15%, transparent)" },
  { id: "cyan",     label: "Cyan",     light: "#cffafe", dark: "color-mix(in oklab, #22d3ee 15%, transparent)" },
  { id: "azul",     label: "Azul",     light: "#dbeafe", dark: "color-mix(in oklab, #60a5fa 15%, transparent)" },
  { id: "violeta",  label: "Violeta",  light: "#ede9fe", dark: "color-mix(in oklab, #a78bfa 15%, transparent)" },
  { id: "rosa",     label: "Rosa",     light: "#fce7f3", dark: "color-mix(in oklab, #f472b6 15%, transparent)" },
  { id: "piedra",   label: "Piedra",   light: "#f5f5f4", dark: "color-mix(in oklab, #a8a29e 15%, transparent)" },
] as const;
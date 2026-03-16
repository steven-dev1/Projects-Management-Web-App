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
  { label: "Zinc",    value: "#f4f4f5", text: "#3f3f46" },
  { label: "Rojo",    value: "#fee2e2", text: "#991b1b" },
  { label: "Naranja", value: "#ffedd5", text: "#9a3412" },
  { label: "Amarillo",value: "#fef9c3", text: "#854d0e" },
  { label: "Verde",   value: "#dcfce7", text: "#166534" },
  { label: "Cyan",    value: "#cffafe", text: "#155e75" },
  { label: "Azul",    value: "#dbeafe", text: "#1e40af" },
  { label: "Violeta", value: "#ede9fe", text: "#5b21b6" },
  { label: "Rosa",    value: "#fce7f3", text: "#9d174d" },
  { label: "Piedra",  value: "#f5f5f4", text: "#44403c" },
] as const;
export const KANBAN_LISTS = [
  {
    name: "Backlog",
    count: 3,
    cards: [
      {
        title: "Diseñar sistema de auth",
        label: "bg-blue-100",
        chip: "Frontend",
        chipColor: "bg-blue-100 text-blue-700",
        avatar: "bg-zinc-200",
        done: true,
      },
      {
        title: "Setup base de datos",
        label: "bg-pink-100",
        chip: "Backend",
        chipColor: "bg-blue-100 text-blue-700",
        avatar: "bg-blue-200",
        done: true,
      },
    ],
  },
  {
    name: "En curso",
    count: 2,
    cards: [
      {
        title: "Integración con IA",
        label: "bg-green-100",
        chip: "Urgente",
        chipColor: "bg-red-100 text-red-700",
        avatar: "bg-yellow-200",
        done: false,
      },
    ],
  },
  {
    name: "Revisar",
    count: 1,
    cards: [
      {
        title: "Optimizar queries",
        label: "bg-amber-100",
        chip: "Review",
        chipColor: "bg-green-100 text-green-700",
        avatar: "bg-zinc-200",
        done: false,
      },
    ],
  },
  {
    name: "Listo",
    count: 4,
    cards: [
      {
        title: "Setup del proyecto",
        label: "bg-zinc-100",
        chip: "Done",
        chipColor: "bg-green-100 text-green-700",
        avatar: "bg-zinc-200",
        done: true,
      },
      {
        title: "Diseño de UI",
        label: "bg-zinc-100",
        chip: "Done",
        chipColor: "bg-green-100 text-green-700",
        avatar: "bg-blue-200",
        done: true,
      },
    ],
  },
];

export const TABLE_ROWS = [
  {
    title: "Integración con IA",
    list: "En curso",
    assignee: "Carlos M.",
    avatarColor: "bg-yellow-200",
    date: "15 mar",
    dateColor: "text-red-600 font-medium",
    status: "Pendiente",
    statusClass: "bg-zinc-100 text-zinc-600",
  },
  {
    title: "Optimizar queries",
    list: "Revisar",
    assignee: "Ana P.",
    avatarColor: "bg-blue-200",
    date: "20 mar",
    dateColor: "text-zinc-600",
    status: "Pendiente",
    statusClass: "bg-zinc-100 text-zinc-600",
  },
  {
    title: "Setup del proyecto",
    list: "Listo",
    assignee: "Luis R.",
    avatarColor: "bg-zinc-200",
    date: "10 mar",
    dateColor: "text-zinc-600",
    status: "Completada",
    statusClass: "bg-green-100 text-green-700",
  },
  {
    title: "Diseño de UI",
    list: "Listo",
    assignee: "Ana P.",
    avatarColor: "bg-blue-200",
    date: "8 mar",
    dateColor: "text-zinc-600",
    status: "Completada",
    statusClass: "bg-green-100 text-green-700",
  },
];

export const FEATURES = [
  {
    icon: "📋",
    color: "bg-blue-50",
    title: "Tableros kanban",
    desc: "Arrastra y suelta tarjetas entre listas. Organiza tu flujo de trabajo visualmente con posición persistente.",
  },
  {
    icon: "✅",
    color: "bg-green-50",
    title: "Checklists y progreso",
    desc: "Divide cada tarjeta en subtareas con checklists. Ve el progreso de un vistazo desde el tablero.",
  },
  {
    icon: "🔔",
    color: "bg-amber-50",
    title: "Notificaciones en tiempo real",
    desc: "Recibe alertas instantáneas cuando te asignen una tarjeta o te inviten a un board. Sin recargar la página.",
  },
  {
    icon: "👥",
    color: "bg-pink-50",
    title: "Colaboración en equipo",
    desc: "Invita miembros a tus boards por email. Asigna tarjetas a personas específicas y trabaja juntos.",
  },
  {
    icon: "🧩",
    color: "bg-violet-50",
    title: "Plantillas predefinidas",
    desc: "Arranca en segundos con plantillas de desarrollo, marketing, ventas, RRHH y más.",
  },
  {
    icon: "📅",
    color: "bg-cyan-50",
    title: "Fechas límite",
    desc: "Asigna due dates a tus tarjetas. Ve las próximas fechas en el dashboard y recibe alertas de vencimiento.",
  },
];

export const STATS = [
  { num: "10k+", label: "Tareas organizadas" },
  { num: "6", label: "Plantillas listas" },
  { num: "3", label: "Vistas disponibles" },
  { num: "100%", label: "Tiempo real" },
];

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Vistas", href: "#vistas" },
];

export type TabType = "kanban" | "table" | "dashboard";

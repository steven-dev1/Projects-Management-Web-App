# Projects M. 📋

Aplicación de gestión de proyectos colaborativa basada en tableros Kanban, construida con Next.js, Supabase y Redux Toolkit.

## Tabla de contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Testing](#testing)

---

## Descripción

Projects M. es una herramienta de gestión de tareas y proyectos en equipo. Permite crear tableros Kanban con listas y tarjetas, asignar tareas a miembros, establecer fechas límite, agregar checklists, etiquetas y mucho más. Todo en tiempo real gracias a Supabase Realtime.

---

## Características

- **Tableros Kanban** — Crea tableros con múltiples listas y arrastra tarjetas entre ellas con drag & drop
- **3 vistas por tablero** — Vista Kanban, Vista Tabla y Panel de estadísticas
- **Tarjetas completas** — Título, descripción enriquecida, fecha límite, etiquetas, checklists y asignación de miembros
- **Colaboración en equipo** — Invita miembros por email con roles (admin / miembro)
- **Notificaciones en tiempo real** — Recibe alertas cuando te asignan una tarjeta o te invitan a un tablero
- **Elementos archivados** — Archiva y restaura tarjetas y listas sin perder datos
- **Plantillas** — Crea tableros desde plantillas predefinidas (Desarrollo, Marketing, Ventas, RRHH, etc.)
- **Dashboard personal** — Estadísticas, tarjetas asignadas, fechas próximas y actividad reciente
- **Autenticación completa** — Registro, login, recuperación y cambio de contraseña
- **Modo claro / oscuro** — Tema configurable por el usuario
- **Responsive** — Funciona en móvil, tablet y escritorio

---

## Tecnologías

| Categoría | Tecnología |
|-----------|-----------|
| Framework | Next.js 15 (App Router) |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Estado global | Redux Toolkit |
| Estilos | Tailwind CSS v4 |
| Componentes UI | HeroUI |
| Drag & Drop | @dnd-kit |
| Editor de texto | Tiptap |
| Testing | Vitest + React Testing Library |
| Email | Brevo (Sendinblue) |
| Fetch de datos | SWR |
| Validación | Zod |

---

## Requisitos previos

- Node.js 18+
- npm o pnpm
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Brevo](https://brevo.com) (para emails de invitación)

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/steven-dev1/projects-m.git
cd projects-m

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Brevo (emails)
BREVO_API_KEY=tu-api-key-de-brevo
```

---

## Estructura del proyecto

```
src/
├── app/                        # Rutas de Next.js (App Router)
│   ├── (app)/                  # Rutas protegidas
│   │   ├── boards/[id]/        # Vista de tablero (kanban, tabla, panel)
│   │   ├── dashboard/          # Dashboard y proyectos
│   │   ├── settings/           # Configuración de usuario
│   │   └── invite/[token]/     # Aceptar invitaciones
│   ├── (auth)/                 # Rutas de autenticación
│   │   ├── signin/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   └── api/                    # API Routes
│       └── boards/
├── components/                 # Componentes React
│   ├── Auth/                   # Formularios de autenticación
│   ├── Board/                  # Componentes del tablero
│   │   ├── Cards/              # Tarjetas y modal de detalle
│   │   ├── Lists/              # Listas del tablero
│   │   ├── Panel/              # Vista de estadísticas
│   │   └── Table/              # Vista de tabla
│   ├── Dashboard/              # Componentes del dashboard
│   ├── Notifications/          # Sistema de notificaciones
│   └── UI/                     # Componentes reutilizables
├── hooks/                      # Custom hooks
│   ├── useBoardDnd.ts          # Lógica de drag & drop
│   ├── useBoardDndLogic.ts     # Cálculos de movimiento
│   ├── useBoardStats.ts        # Estadísticas del tablero
│   ├── useDashboardStats.ts    # Estadísticas del dashboard
│   └── useArchivedItems.ts     # Elementos archivados
├── store/                      # Redux store
│   └── features/
│       ├── auth/               # Estado de autenticación
│       ├── boards/             # Estado de tableros, listas, tarjetas
│       │   └── reducers/       # Reducers separados por dominio
│       └── notifications/      # Estado de notificaciones
├── services/                   # Servicios de Supabase
│   ├── boardsService.ts
│   ├── cardsService.ts
│   ├── listsService.ts
│   ├── checklistsService.ts
│   ├── labelsService.ts
│   └── membersService.ts
├── lib/                        # Utilidades y configuración
│   ├── supabaseClient.ts       # Cliente de Supabase (browser)
│   ├── supabaseServer.ts       # Cliente de Supabase (server)
│   ├── dateUtils.ts            # Utilidades de fechas
│   ├── sanitize.ts             # Sanitización de HTML
│   └── templates.ts            # Plantillas de tableros
└── types/                      # Tipos de TypeScript
```

---

## Arquitectura

### Estado global

El estado se maneja con Redux Toolkit dividido en tres slices:

- **`auth`** — Usuario, perfil y preferencias
- **`boards`** — Tableros, listas, tarjetas y todo su contenido
- **`notifications`** — Notificaciones del usuario

Los thunks siguen el patrón: llaman al servicio correspondiente → si hay error retornan `rejectWithValue` → el reducer actualiza el estado optimísticamente.

### Drag & Drop

El sistema de DnD usa `@dnd-kit`:

- **`useBoardDnd`** — Maneja los eventos del drag (start, over, end) y despacha acciones

El movimiento es optimista: primero se actualiza el estado local con `moveCard`/`moveList`, luego se persiste en Supabase con `updateCardOrder`/`updateListOrderSupabase`.

### Servicios

Cada entidad tiene su propio servicio que encapsula las llamadas a Supabase. Los thunks de Redux consumen estos servicios. Esto facilita el testing y el mantenimiento.

---

## Testing

El proyecto usa **Vitest** con **React Testing Library**. Los tests cubren:

- Componentes UI (`CardDetailModal`, `CardView`, formularios de auth)
- Thunks de Redux (boards, cards, listas, checklists, etiquetas)
- Lógica pura de DnD (`calculateCardMove`, `calculateListMove`)

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar en modo watch
npm run test:watch

# Ver cobertura
npm run test:coverage
```

Los tests de thunks mockean Supabase y verifican que el estado de Redux se actualice correctamente después de cada acción.
# 🗂️ Projects M.

**Projects M.** is a collaborative project management app inspired by Trello, built with a modern stack. It lets you organize your work in kanban boards, assign tasks to team members, set due dates, track progress with checklists, and get real-time notifications — all in one place.

---

## ✨ Features

### 🗃️ Boards & Lists
- Create, edit, and delete boards with custom backgrounds
- Drag & drop lists and cards with full position persistence
- Archive boards and lists with soft delete
- Board templates (Software, Marketing, Project Management, HR, Sales, Learning)

### 🃏 Cards
- Rich card detail modal with inline editing
- Due dates with overdue highlighting
- Labels with custom colors
- Checklists with progress tracking
- Mark cards as completed
- Assign members to cards
- Soft delete & restore cards

### 👥 Collaboration
- Invite members to boards via email (Brevo)
- Role-based access (owner / member)
- Board-level sharing with RLS policies

### 🔔 Notifications
- Real-time in-app notifications via Supabase Realtime
- Toast alerts when a notification arrives
- Bell icon with unread count in the navbar
- Mark as read / mark all as read
- Notifications triggered on: card assignment, board invite

### 📊 Dashboard
- Quick stats: total boards, cards, completed, completion rate
- Recently active boards
- My assigned cards
- Upcoming due dates (next 7 days)

### 📋 Table View
- View all cards in a board as a sortable table
- Sort by title, list, assignee, due date, or status
- Filter by list
- Click any row to open the card detail modal

### 🧩 Templates
- 6 predefined board templates
- Each template creates a board with pre-filled lists and sample cards
- Custom board name on creation

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| State Management | Redux Toolkit |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| Real-time | Supabase Realtime |
| UI Components | HeroUI / NextUI |
| Styling | Tailwind CSS v4 |
| Drag & Drop | dnd-kit |
| Rich Text | Tiptap |
| Email | Brevo |
| Icons | Lucide React |
| Date Utils | date-fns |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- A Brevo account (for email invitations)

### Installation

```bash
git clone https://github.com/steven-dev1/Projects-Management-Web-App.git
cd Projects-Management-Web-App
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
NEXT_PUBLIC_APP_URL=your_app_url
BREVO_API_KEY=your_brevo_api_key
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema

### Core Tables
- `boards` — project boards with owner and status
- `lists` — columns inside a board, ordered by position
- `cards` — tasks inside a list with title, description, due date, assignee
- `board_members` — many-to-many between boards and users with roles
- `profiles` — extended user info (full name, avatar)

### Card Features
- `labels` — label definitions per board
- `card_labels` — many-to-many between cards and labels
- `checklists` — checklists per card
- `checklist_items` — individual items per checklist

### System
- `notifications` — in-app notifications per user

All tables have **Row Level Security (RLS)** enabled.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (app)/
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── page.tsx        # Home with stats
│   │   │   ├── projects/       # All boards
│   │   │   └── templates/      # Board templates
│   │   └── boards/
│   │       └── [id]/
│   │           ├── page.tsx    # Kanban view
│   │           ├── table/      # Table view
│   │           └── panel/      # Panel view
│   └── api/                    # API routes
├── components/
│   ├── board/                  # Board, list, card components
│   ├── Dashboard/              # Dashboard components
│   └── notifications/          # Bell, listener
├── store/
│   ├── features/               # Redux slices & thunks
│   └── hooks.ts
├── types/                      # TypeScript interfaces
└── lib/
    ├── supabase.ts
    ├── supabase-server.ts
    └── templates.ts
```

---

## 📄 License

MIT
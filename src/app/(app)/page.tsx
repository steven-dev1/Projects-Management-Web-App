"use client";
import { ThemeToggle } from "@/components/UI/ThemeToggle";
import { Unlink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const KANBAN_LISTS = [
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

const TABLE_ROWS = [
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

const FEATURES = [
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

type TabType = "kanban" | "table" | "dashboard";

function MockupCard({
  label,
  title,
  date,
  avatarColor = "bg-zinc-200",
  done = false,
}: {
  label: string;
  title: string;
  date: string;
  avatarColor?: string;
  done?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 dark:border-zinc-900 dark:text-zinc-200 border border-zinc-200 rounded-lg p-2.5 mb-2 last:mb-0">
      <div className={`h-1 w-7 rounded-full ${label} mb-2`} />
      <p className={`text-[11px] mb-2 leading-tight ${done ? "line-through" : ""}`}>
        {title}
      </p>
      <div className="flex items-center justify-between">
        <div className={`w-4 h-4 rounded-full ${avatarColor}`} />
        <span className="text-[10px] text-zinc-400">{date}</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<TabType>("kanban");

  const tabUrl =
    activeTab === "kanban" ? "boards/mi-proyecto" : activeTab === "table" ? "boards/mi-proyecto/table" : "dashboard";

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-200">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4 bg-white/90 dark:bg-zinc-900 backdrop-blur-md border-b dark:border-zinc-800 border-zinc-200">
        <Link href="/" className="text-lg flex items-center gap-2 font-semibold tracking-tight">
          <Unlink color="#006fee" size="32" />
          Projects M.
        </Link>
        <ul className="flex items-center gap-8 list-none m-0">
          <li>
            <a
              href="#features"
              className="text-sm text-zinc-500 dark:text-zinc-200 dark:hover:text-zinc-400 hover:text-zinc-900 transition-colors no-underline"
            >
              Features
            </a>
          </li>
          <li>
            <a
              href="#vistas"
              className="text-sm text-zinc-500 dark:text-zinc-200 dark:hover:text-zinc-400 hover:text-zinc-900 transition-colors no-underline"
            >
              Vistas
            </a>
          </li>
          <li>
            <Link
              href="/signin"
              className="text-sm text-zinc-500 dark:text-zinc-200 dark:hover:text-zinc-400 hover:text-zinc-900 transition-colors no-underline"
            >
              Iniciar sesión
            </Link>
          </li>
          <li>
            <Link
              href="/signup"
              className="text-sm font-medium bg-zinc-900 dark:bg-white dark:text-zinc-950 text-white dark:hover:text-zinc-700 px-4 py-2 rounded-lg transition-opacity no-underline"
            >
              Empezar gratis
            </Link>
          </li>
          <li>
            <ThemeToggle iconOnly />
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto pt-40 pb-24 px-10 grid grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-500 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            Gestión de proyectos simplificada
          </div>
          <h1 className="text-[3.5rem] font-semibold tracking-tight leading-[1.08] mb-5">
            Organiza tu trabajo, <em className="not-italic text-blue-600 font-light">sin el caos.</em>
          </h1>
          <p className="text-lg text-zinc-500 leading-relaxed mb-8 max-w-md">
            Projects M. es un tablero kanban colaborativo donde tu equipo puede planificar, asignar y entregar trabajo —
            todo en un solo lugar.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-6 py-3 rounded-xl hover:opacity-85 transition-opacity no-underline"
            >
              Crear cuenta gratis
            </Link>
            <a href="#features" className="text-sm dark:text-zinc-200 dark:hover:text-zinc-400 text-zinc-500 hover:text-zinc-900 transition-colors no-underline">
              Ver features →
            </a>
          </div>
        </div>

        <div className="relative">
          <div
            className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
          >
            <div className="flex items-center gap-1.5 pb-3 mb-4 border-b border-zinc-200 dark:border-zinc-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-200 font-medium">Desarrollo de software</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(["To Do", "En progreso", "Done"] as const).map((list, i) => (
                <div key={list} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">{list}</p>
                  {i === 0 && (
                    <>
                      <MockupCard label="bg-blue-100 dark:bg-blue-600" title="Diseñar arquitectura" date="12 mar" />
                      <MockupCard label="bg-pink-100 dark:bg-pink-600" title="Setup CI/CD" date="15 mar" avatarColor="bg-pink-200 dark:bg-pink-600" />
                    </>
                  )}
                  {i === 1 && (
                    <MockupCard
                      label="bg-green-100 dark:bg-emerald-600"
                      title="Auth con Supabase"
                      date="14 mar"
                      avatarColor="bg-blue-200 dark:bg-blue-600"
                    />
                  )}
                  {i === 2 && <MockupCard label="bg-zinc-100 dark:bg-zinc-800" title="Setup del proyecto" date="10 mar" done />}
                </div>
              ))}
            </div>
          </div>
          <div
            className="absolute -bottom-5 -left-5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
          >
            <div className="w-8 h-8 bg-green-100 dark:bg-emerald-600 rounded-lg flex items-center justify-center text-sm shrink-0">✓</div>
            <div>
              <p className="text-xs font-medium leading-none mb-1">3 tareas completadas</p>
              <p className="text-[10px] text-zinc-400 leading-none">hoy · equipo de 4</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className=" border-y border-zinc-200 dark:border-zinc-900 py-10 px-10 w-full">
        <div className="max-w-6xl mx-auto flex justify-around flex-wrap gap-8">
          {[
            { num: "10k+", label: "Tareas organizadas" },
            { num: "6", label: "Plantillas listas" },
            { num: "3", label: "Vistas disponibles" },
            { num: "100%", label: "Tiempo real" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-semibold tracking-tight">{s.num}</p>
              <p className="text-sm text-zinc-400 dark:text-zinc-200 font-light mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="py-28 px-10 max-w-6xl mx-auto" id="features">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Features</p>
        <h2 className="text-5xl font-semibold tracking-tight leading-tight mb-4">
          Todo lo que necesitas
          <br />
          para trabajar mejor.
        </h2>
        <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-lg mb-16 leading-relaxed">
          Desde tableros kanban hasta notificaciones en tiempo real — diseñado para equipos que quieren moverse rápido.
        </p>
        <div className="grid grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border border-zinc-200 rounded-2xl p-8 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-100 cursor-default"
            >
              <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center text-xl mb-5`}>
                {f.icon}
              </div>
              <h3 className="text-base font-medium mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section className=" border-zinc-200 py-28 px-10" id="vistas">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Vistas</p>
          <h2 className="text-5xl font-semibold tracking-tight leading-tight mb-4">Tu trabajo, como quieras verlo.</h2>
          <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-lg mb-10 leading-relaxed">
            Cambia entre vistas sin perder nada. Kanban para el día a día, tabla para analizar, dashboard para el
            panorama completo.
          </p>

          <div className="flex gap-2 mb-6 flex-wrap">
            {(["kanban", "table", "dashboard"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg border text-sm transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-zinc-900 dark:bg-zinc-700 text-white border-zinc-900 font-medium"
                    : "bg-white dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 text-zinc-500 border-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500"
                }`}
              >
                {tab === "kanban" ? "Tablero kanban" : tab === "table" ? "Vista tabla" : "Dashboard"}
              </button>
            ))}
          </div>

          <div
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.06)" }}
          >
            <div className=" border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
              <span className="ml-2 rounded px-3 py-1 text-xs text-zinc-400 dark:text-zinc-200">projects-m.app/{tabUrl}</span>
            </div>

            <div className="p-6">
              {activeTab === "kanban" && (
                <div className="grid grid-cols-4 gap-4">
                  {KANBAN_LISTS.map((list) => (
                    <div key={list.name} className="bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 border border-zinc-200 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-200 uppercase tracking-widest">
                          {list.name}
                        </span>
                        <span className="bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 text-zinc-500 text-[10px] px-1.5 py-0.5 rounded">
                          {list.count}
                        </span>
                      </div>
                      {list.cards.map((card) => (
                        <div
                          key={card.title}
                          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 mb-2 last:mb-0"
                        >
                          <div className={`h-1 w-7 rounded-full ${card.label} mb-2`} />
                          <p
                            className={`text-xs mb-2 leading-tight ${card.done ? "line-through text-zinc-400 dark:text-zinc-200" : "text-zinc-800 dark:text-zinc-200"}`}
                          >
                            {card.title}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${card.chipColor}`}>
                              {card.chip}
                            </span>
                            <div className={`w-4 h-4 rounded-full ${card.avatar}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "table" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                        {["Tarjeta ↕", "Lista ↕", "Asignado ↕", "Fecha límite ↕", "Estado ↕"].map((h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-400 dark:text-zinc-200 uppercase tracking-widest"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_ROWS.map((row) => (
                        <tr key={row.title} className="border-b dark:border-zinc-700 border-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">{row.title}</td>
                          <td className="px-4 py-3">
                            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-200 text-xs px-2 py-0.5 rounded-full">
                              {row.list}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded-full shrink-0 ${row.avatarColor}`} />
                              <span className="text-xs text-zinc-600 dark:text-zinc-200">{row.assignee}</span>
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-xs ${row.dateColor}`}>{row.date}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${row.statusClass}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "dashboard" && (
                <div>
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    {[
                      { num: "4", label: "Boards", color: "text-blue-600 bg-white dark:bg-blue-600" },
                      { num: "16", label: "Tarjetas totales", color: "text-violet-600 dark:bg-violet-600" },
                      { num: "10", label: "Completadas", color: "text-emerald-600 dark:bg-emerald-600" },
                      { num: "63%", label: "Tasa de completado", color: "text-amber-600 dark:bg-amber-600" },
                    ].map((s) => (
                      <div key={s.label} className={`border border-zinc-200 dark:border-transparent rounded-xl p-4 ${s.color}`}>
                        <p className={`text-3xl font-semibold dark:text-white tracking-tight ${s.color}`}>{s.num}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-100 dark:font-medium mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-50 border dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl p-4">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-100 mb-3">✓ Mis tarjetas</p>
                      {[
                        { title: "Integración con IA", board: "Kanban Clone" },
                        { title: "Optimizar código", board: "Kanban Clone" },
                      ].map((c) => (
                        <div
                          key={c.title}
                          className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-700 last:border-0"
                        >
                          <div>
                            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{c.title}</p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{c.board}</p>
                          </div>
                          <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-200 text-[10px] px-2 py-0.5 rounded-full font-medium">
                            Pendiente
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-zinc-50 border dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl p-4">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-100 mb-3">📅 Próximas fechas</p>
                      {[
                        { title: "Integración con IA", board: "Kanban Clone", date: "15 mar", urgent: true },
                        { title: "Definir requerimientos", board: "Desarrollo", date: "20 mar", urgent: false },
                      ].map((c) => (
                        <div
                          key={c.title}
                          className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-700 last:border-0"
                        >
                          <div>
                            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-100">{c.title}</p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{c.board}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-xs font-medium ${c.urgent ? "text-red-500" : "text-zinc-600 dark:text-zinc-300"}`}>
                              {c.date}
                            </p>
                            <p className={`text-[10px] ${c.urgent ? "text-red-400" : "text-zinc-400"}`}>
                              {c.urgent ? "En 2 días" : "En 7 días"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-10 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-5xl font-semibold tracking-tight leading-tight mb-4">
            Listo para <em className="not-italic text-blue-600 font-light">organizarte de verdad?</em>
          </h2>
          <p className="text-base text-zinc-500 font-light dark:font-medium mb-10 leading-relaxed">
            Crea tu primer board en menos de un minuto. Sin tarjeta de crédito, sin complicaciones.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-zinc-900 text-white text-base font-medium px-8 py-4 rounded-xl hover:opacity-85 transition-opacity no-underline"
          >
            Empezar gratis →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-zinc-900 dark:text-zinc-200 px-10 py-12">
        <div className="w-full mx-auto flex items-center justify-between flex-wrap gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight no-underline">
            Projects <span className="text-blue-400">M.</span>
          </Link>
          <ul className="flex gap-8 list-none m-0 flex-wrap">
            {[
              { label: "Features", href: "#features" },
              { label: "Vistas", href: "#vistas" },
              { label: "Iniciar sesión", href: "/signin" },
              { label: "Registro", href: "/signup" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-sm hover:text-zinc-400 transition-colors no-underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <span className="text-sm ">© 2026 Projects M.</span>
        </div>
      </footer>
    </div>
  );
}

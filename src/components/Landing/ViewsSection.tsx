"use client";
import { useState } from "react";
import { KANBAN_LISTS, TABLE_ROWS, TabType } from "./LandingData";

function KanbanView() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {KANBAN_LISTS.map((list) => (
        <div
          key={list.name}
          className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-300 uppercase tracking-widest">
              {list.name}
            </span>
            <span className="bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-300 text-[10px] px-1.5 py-0.5 rounded">
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
                className={`text-xs mb-2 leading-tight ${card.done ? "line-through text-zinc-400" : "text-zinc-800 dark:text-zinc-200"}`}
              >
                {card.title}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${card.chipColor}`}>{card.chip}</span>
                <div className={`w-4 h-4 rounded-full ${card.avatar}`} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function TableView() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-125">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
            {["Tarjeta ↕", "Lista ↕", "Asignado ↕", "Fecha límite ↕", "Estado ↕"].map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 text-[11px] font-semibold text-zinc-400 dark:text-zinc-300 uppercase tracking-widest"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map((row) => (
            <tr
              key={row.title}
              className="border-b border-zinc-100 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <td className="px-4 py-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">{row.title}</td>
              <td className="px-4 py-3">
                <span className="bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-200 text-xs px-2 py-0.5 rounded-full">
                  {row.list}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full shrink-0 ${row.avatarColor}`} />
                  <span className="text-xs text-zinc-600 dark:text-zinc-300">{row.assignee}</span>
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
  );
}

function DashboardView() {
  const stats = [
    { num: "4", label: "Boards", color: "text-blue-600" },
    { num: "16", label: "Tarjetas totales", color: "text-violet-600" },
    { num: "10", label: "Completadas", color: "text-emerald-600" },
    { num: "63%", label: "Tasa de completado", color: "text-amber-600" },
  ];
  const myCards = [
    { title: "Integración con IA", board: "Kanban Clone" },
    { title: "Optimizar código", board: "Kanban Clone" },
  ];
  const dates = [
    { title: "Integración con IA", board: "Kanban Clone", date: "15 mar", urgent: true },
    { title: "Definir requerimientos", board: "Desarrollo", date: "20 mar", urgent: false },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4">
            <p className={`text-2xl md:text-3xl font-semibold tracking-tight ${s.color}`}>{s.num}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-300 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-300 mb-3">✓ Mis tarjetas</p>
          {myCards.map((c) => (
            <div
              key={c.title}
              className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-700 last:border-0"
            >
              <div>
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{c.title}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">{c.board}</p>
              </div>
              <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-300 text-[10px] px-2 py-0.5 rounded-full font-medium">
                Pendiente
              </span>
            </div>
          ))}
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-300 mb-3">📅 Próximas fechas</p>
          {dates.map((c) => (
            <div
              key={c.title}
              className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-700 last:border-0"
            >
              <div>
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{c.title}</p>
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
  );
}

const TABS: { key: TabType; label: string }[] = [
  { key: "kanban", label: "Tablero kanban" },
  { key: "table", label: "Vista tabla" },
  { key: "dashboard", label: "Dashboard" },
];

export default function ViewsSection() {
  const [activeTab, setActiveTab] = useState<TabType>("kanban");

  const tabUrl =
    activeTab === "kanban" ? "boards/mi-proyecto" : activeTab === "table" ? "boards/mi-proyecto/table" : "dashboard";

  return (
    <section className="py-20 md:py-28 px-6 md:px-10" id="vistas">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Vistas</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4">
          Tu trabajo, como quieras verlo.
        </h2>
        <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-lg mb-8 md:mb-10 leading-relaxed">
          Cambia entre vistas sin perder nada. Kanban para el día a día, tabla para analizar, dashboard para el panorama
          completo.
        </p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg border text-sm transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-zinc-900 dark:bg-zinc-700 text-white border-zinc-900 font-medium"
                  : "bg-white dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 text-zinc-500 border-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.06)" }}
        >
          <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <span className="w-2 h-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 rounded px-3 py-1 text-xs text-zinc-400 dark:text-zinc-300 truncate">
              projects-m.app/{tabUrl}
            </span>
          </div>
          <div className="p-4 md:p-6">
            {activeTab === "kanban" && <KanbanView />}
            {activeTab === "table" && <TableView />}
            {activeTab === "dashboard" && <DashboardView />}
          </div>
        </div>
      </div>
    </section>
  );
}

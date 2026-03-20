"use client";

import { Board, Card } from "@/store/features/boards/BoardsTypes";

interface Props {
  boards: Board[];
  allCards: Card[];
}

export default function DashboardStats({ boards, allCards }: Props) {
  const totalBoards = boards.length;
  const totalCards = allCards.length;
  const completedCards = allCards.filter((c) => c.is_completed).length;
  const completionRate = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;

  const stats = [
    { label: "Tableros", value: totalBoards, className: "bg-blue-50 text-blue-600 dark:bg-blue-600 dark:text-white" },
    {
      label: "Tarjetas totales",
      value: totalCards,
      className: "bg-violet-50 text-violet-600 dark:bg-violet-600 dark:text-white",
    },
    {
      label: "Completadas",
      value: completedCards,
      className: "bg-emerald-50 text-emerald-600 dark:bg-emerald-600 dark:text-white",
    },
    {
      label: "Tasa de completado",
      value: `${completionRate}%`,
      className: "bg-amber-50 text-amber-600 dark:bg-amber-600 dark:text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`rounded-xl p-4 ${stat.className}`}>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-sm mt-1 opacity-75">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

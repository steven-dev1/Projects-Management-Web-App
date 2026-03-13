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
    { label: "Boards", value: totalBoards, color: "bg-blue-50 text-blue-600" },
    { label: "Tarjetas totales", value: totalCards, color: "bg-violet-50 text-violet-600" },
    { label: "Completadas", value: completedCards, color: "bg-emerald-50 text-emerald-600" },
    { label: "Tasa de completado", value: `${completionRate}%`, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-sm mt-1 opacity-75">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

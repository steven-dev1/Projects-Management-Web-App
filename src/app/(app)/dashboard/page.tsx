'use client';
import { useAppSelector } from "@/store/hooks";
import { Spinner } from "@heroui/react";
import { Clock, CheckSquare, CalendarClock } from "lucide-react";
import EmptyProjects from "@/components/Dashboard/EmptyProjects";
import DashboardStats from "@/components/Dashboard/DashboardStats";
import MyAssignedCards from "@/components/Dashboard/MyAssignedCards";
import UpcomingDueDates from "@/components/Dashboard/UpcomingDueDates";
import ProjectsList from "@/components/Dashboard/ProjectsList";

export default function DashboardPage() {
  const { boards, status } = useAppSelector((state) => state.boards);
  const currentUser = useAppSelector((state) => state.auth.user);

  if (status === "loading" && boards.length === 0) {
    return <div className="flex items-center justify-center"><Spinner color="default" size="lg" /></div>;
  }

  if (boards.length === 0 && status === "succeeded") {
    return <EmptyProjects />;
  }

  const recentBoards = boards
    .filter((board) => new Date(board.updated_at).getTime() > new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
    .slice(0, 3);

  // Todas las cards de todos los boards
  const allCards = boards.flatMap((board) =>
    (board.lists ?? []).flatMap((list) => list.cards ?? [])
  );

  // Cards asignadas al usuario actual
  const assignedCards = allCards.filter((card) => card.assigned_to === currentUser?.id);

  // Cards con due date en los próximos 7 días
  const now = new Date();
  const in7Days = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7);
  const upcomingCards = allCards.filter((card) => {
    if (!card.due_date || card.is_completed) return false;
    const due = new Date(card.due_date);
    return due >= now && due <= in7Days;
  });

  return (
    <div className="flex flex-col gap-16 p-6">
      {/* Estadísticas */}
      <DashboardStats boards={boards} allCards={allCards} />

      {/* Actividad reciente */}
      <section>
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <Clock size={18} /> Actividad reciente
        </h3>
        <ProjectsList boards={recentBoards} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mis tarjetas asignadas */}
        <section>
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <CheckSquare size={18} /> Mis tarjetas
          </h3>
          <MyAssignedCards cards={assignedCards} boards={boards} />
        </section>

        {/* Due dates próximos */}
        <section>
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <CalendarClock size={18} /> Próximas fechas límite
          </h3>
          <UpcomingDueDates cards={upcomingCards} boards={boards} />
        </section>
      </div>
    </div>
  );
}
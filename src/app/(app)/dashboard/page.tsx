"use client";
import { Spinner } from "@heroui/react";
import { CheckSquare, CalendarClock } from "lucide-react";
import EmptyProjects from "@/components/Dashboard/EmptyProjects";
import DashboardStats from "@/components/Dashboard/DashboardStats";
import MyAssignedCards from "@/components/Dashboard/MyAssignedCards";
import UpcomingDueDates from "@/components/Dashboard/UpcomingDueDates";
import MaxWidth from "@/components/UI/MaxWidth";
import LastActivity from "@/components/Dashboard/LastActivity";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function DashboardPage() {
  const { boards, status, allCards, assignedCards, upcomingCards, activeBoards } = useDashboardStats();

  const isLoading = status === "loading" || status === "idle";

  if (isLoading && boards.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <Spinner color="default" size="lg" />
      </div>
    );
  }

  if (status === "succeeded" && boards.length === 0) {
    return <EmptyProjects />;
  }

  return (
    <MaxWidth className="flex flex-col gap-16 p-6">
      <DashboardStats boards={boards} allCards={allCards} />
      <LastActivity boards={activeBoards} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <CheckSquare size={18} /> Mis tarjetas
          </h3>
          <MyAssignedCards cards={assignedCards} boards={boards} />
        </section>
        <section>
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <CalendarClock size={18} /> Próximas fechas límite
          </h3>
          <UpcomingDueDates cards={upcomingCards} boards={boards} />
        </section>
      </div>
    </MaxWidth>
  );
}

import { BoardMember } from "@/types";
import { Avatar } from "@heroui/avatar";
import { Progress } from "@heroui/react";

export default function PanelMembers({ memberStats }: { memberStats: { member: BoardMember, total: number, completed: number }[] }) {
  return (
    <div className="bg-content1 rounded-2xl p-5 shadow-small flex flex-col gap-3">
      <p className="text-sm font-semibold">Miembros con tareas</p>
      {memberStats
        .filter((m) => m.total > 0)
        .map(({ member, total: mt, completed: mc }) => (
          <div key={member.user_id} className="flex items-center gap-3">
            <Avatar
              src={member.profiles?.avatar_url ?? undefined}
              name={member.profiles?.full_name ?? "?"}
              size="sm"
              color="secondary"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate mb-1">{member.profiles?.full_name ?? "Usuario"}</p>
              <Progress value={mt > 0 ? Math.round((mc / mt) * 100) : 0} size="sm" color="success" />
            </div>
            <span className="text-xs text-default-400 shrink-0">
              {mc}/{mt}
            </span>
          </div>
        ))}
      {memberStats.every((m) => m.total === 0) && (
        <p className="text-sm text-default-400 text-center py-4">Sin tarjetas asignadas</p>
      )}
    </div>
  );
}

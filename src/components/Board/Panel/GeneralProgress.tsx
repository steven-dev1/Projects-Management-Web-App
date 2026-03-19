import { Card } from "@/store/features/boards/BoardsTypes";
import { Chip, Progress } from "@heroui/react";

export default function GeneralProgress({
  completed,
  total,
  overdue,
  dueSoon,
  rate,
}: {
  completed: number;
  total: number;
  overdue: Card[];
  dueSoon: Card[];
  rate: number;
}) {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-content1 rounded-2xl p-5 shadow-small flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold">Progreso general</p>
        <span className="text-xs text-default-400">
          {completed} / {total} tarjetas
        </span>
      </div>
      <Progress value={rate} color="secondary" size="md" showValueLabel label="Tarjetas completadas" maxValue={100} />
      <div className="flex flex-wrap gap-2 mt-1">
        <Chip classNames={{ content: "font-semibold" }} size="sm" color="success" variant="flat">
          {completed} completadas
        </Chip>
        <Chip classNames={{ content: "font-semibold" }} size="sm" color="danger" variant="flat">
          {overdue.length} vencidas
        </Chip>
        <Chip classNames={{ content: "font-semibold" }} size="sm" color="warning" variant="flat">
          {dueSoon.length} próximas
        </Chip>
      </div>
    </div>
  );
}

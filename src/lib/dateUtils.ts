import { parseAbsoluteToLocal, ZonedDateTime, getLocalTimeZone, now } from "@internationalized/date";

export function isoToZoned(iso: string | null | undefined): ZonedDateTime | null {
  if (!iso) return null;
  try {
    return parseAbsoluteToLocal(iso);
  } catch {
    return null;
  }
}

export function zonedToIso(zdt: ZonedDateTime): string {
  return zdt.toDate().toISOString();
}

export function nowZoned(): ZonedDateTime {
  return now(getLocalTimeZone());
}

export function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDueDateWithTime(iso: string): string {
  const date = new Date(iso);
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;

  if (!hasTime) return formatDueDate(iso);

  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

export function formatDueDateShort(iso: string): string {
  const date = new Date(iso);
//   const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;

  return date.toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

export const getCardDateStatus = (dueDate: string | null | undefined, isCompleted?: boolean) => {
  if (!dueDate || isCompleted) return "none";
  const due = new Date(dueDate);
  const now = new Date();
  if (due < now) return "overdue";
  if (due < new Date(now.getTime() + 24 * 60 * 60 * 1000)) return "due-soon";
  return "ok";
};

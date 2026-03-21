import { Board } from "@/store/features/boards/BoardsTypes";
import { LIST_COLORS } from "./consts";

export function capitalizeWords(str: string) {
  return str.toLowerCase().replace(/(^|\s)\w/g, (letra) => letra.toUpperCase());
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const getAvatarUrl = (avatarPath: string | null | undefined) => {
  if (!avatarPath) return undefined;
  return `${SUPABASE_URL}/storage/v1/object/public/avatars/${avatarPath}`;
};



export function resolveListColor(colorId: string | undefined, isDark: boolean, isBoard?: boolean) {
  if (!colorId) return undefined;
  const found = LIST_COLORS.find((c) => c.id === colorId);
  if (!found) return undefined;
  if (isBoard) return found.board;
  return isDark ? found.dark : found.light;
}

export const getActiveOrArchivedBoards = (boards: Board[], status: "active" | "archived") => {
  return boards.filter((b) => b.status === status);
}



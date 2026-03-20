import { BoardMembersResponse, Checklist, Label } from "@/types";

export interface BoardResponse extends Board {
  lists: BoardList[];
  labels: Label[]
  board_members: BoardMembersResponse;
  created_at: string;
  updated_at: string;
}

export interface UpdatedBoardPayload {
  boardId: string;
  name: string;
  description?: string;
  background_color?: string;
}

export interface Board {
  id: string;
  owner_id: string;
  lists: BoardList[];
  name: string;
  description?: string;
  background_color?: string;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
}

export interface BoardList {
  id: string;
  title: string;
  description?: string;
  cards: Card[];
  position: number;
  board_id: string;
  status: "active" | "archived";
  background_color?: string;
  created_at: string;
  updated_at: string;
}

export interface ListPayload {
  title: string;
  position: number;
  background_color?: string;
  board_id: string;
}

export type UpdateListPayload = {
  listId: string;
  title: string;
  background_color?: string;
};

export interface Card {
  id: string;
  title: string;
  description?: string;
  list_id: string;
  position: number;
  due_date?: string;
  is_completed?: boolean;
  labels?: Label[];
  checklists?: Checklist[];
  assigned_to?: string | null;
  status?: "active" | "archived";
  created_at?: string;
  updated_at?: string;
}

export type CreateCardPayload = Omit<Card, "id" | "created_at" | "updated_at">;

export interface BoardForm {
  id?: string;
  name: string;
  description?: string;
  background_color?: string;
}

export type UpdateCardPayload = {
  cardId: string;
  title: string;
  description?: string;
  due_date?: string | null;
};

export interface BoardsState {
  boards: Board[];
  currentBoard: BoardResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  searchQuery: string,
}

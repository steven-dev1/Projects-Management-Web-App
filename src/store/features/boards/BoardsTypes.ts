import { BoardMembersResponse } from "@/types";

export interface BoardResponse extends Board { 
  lists: BoardList[];
  board_members: BoardMembersResponse;
  created_at: string;
  updated_at: string;
}
export interface Board{
  id?: string;
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
  cards: Card[];
  position: number;
  board_id: string;
  background_color?: string;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id?: string;
  list_id: string;
  title: string;
  description?: string;
  position: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface BoardForm {
  id?: string;
  name: string;
  description?: string;
}

export interface BoardsState {
  boards: Board[];
  currentBoard: BoardResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
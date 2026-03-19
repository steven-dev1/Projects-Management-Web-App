import { Card } from "@/store/features/boards/BoardsTypes";
import { Profile } from "./auth";

export interface BoardMember {
  board_id: string;
  id: string;
  user_id: string;
  role: "admin" | "member";
  created_at: string;
  updated_at: string;
  profiles: Profile;
}

export type BoardMembersResponse = BoardMember[];

export interface Label {
  id: string;
  board_id: string;
  name: string | null;
  color: string;
  created_at: string;
}

export interface CardLabel {
  card_id: string;
  label_id: string;
}

export type CardWithLabels = Card & {
  card_labels?: {
    label_id: string;
    labels: Label;
  }[];
};
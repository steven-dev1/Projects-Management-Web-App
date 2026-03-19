export interface ChecklistItem {
  id: string;
  checklist_id: string;
  title: string;
  is_completed: boolean;
  position: number;
  created_at?: string;
  updated_at?: string;
}

export interface Checklist {
  id: string;
  card_id: string;
  title: string;
  position: number;
  items: ChecklistItem[];
  created_at?: string;
  updated_at?: string;
}
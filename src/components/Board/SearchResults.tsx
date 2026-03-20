import { Card } from "@/store/features/boards/BoardsTypes";
import { BoardList } from "@/store/features/boards/BoardsTypes";
import { HighlightedText } from "./HighlightedText";
import { CalendarIcon, CheckCircle2, Circle, SearchX } from "lucide-react";
import { formatDueDateShort} from "@/lib/dateUtils";

interface SearchGroup {
  list: BoardList;
  cards: Card[];
}

interface Props {
  results: SearchGroup[];
  totalResults: number;
  query: string;
  onSelectCard: (cardId: string) => void;
}

export const SearchResults = ({ results, totalResults, query, onSelectCard }: Props) => {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2 text-zinc-400">
        <SearchX size={20} />
        <p className="text-sm">Sin resultados para &quot;{query}&quot;</p>
      </div>
    );
  }

  return (
    <>
      <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
        <p className="text-xs text-zinc-400">
          {totalResults} {totalResults === 1 ? "resultado" : "resultados"}
        </p>
      </div>
      {results.map(({ list, cards }) => (
        <div key={list.id}>
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 border-b border-zinc-100">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: list.background_color ?? "#a742ff" }}
            />
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide truncate">{list.title}</p>
          </div>
          {cards.map((card) => (
            <SearchResultCard key={card.id} card={card} query={query} onSelect={() => onSelectCard(card.id!)} />
          ))}
        </div>
      ))}
    </>
  );
};

const SearchResultCard = ({ card, query, onSelect }: { card: Card; query: string; onSelect: () => void }) => (
  <button
    type="button"
    onClick={onSelect}
    className="w-full flex cursor-pointer items-start gap-3 px-3 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-50 dark:border-zinc-800 last:border-0 text-left"
  >
    {card.is_completed ? (
      <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
    ) : (
      <Circle size={14} className="text-zinc-300 shrink-0 mt-0.5" />
    )}
    <div className="min-w-0 flex-1">
      <p
        className={`text-sm font-medium truncate ${card.is_completed ? "line-through text-zinc-400" : "text-zinc-700 dark:text-zinc-500"}`}
      >
        <HighlightedText text={card.title} query={query} />
      </p>
      {card.description && (
        <p className="text-xs text-zinc-400 mt-0.5 truncate">{card.description.replace(/<[^>]*>/g, "")}</p>
      )}
      {card.due_date && (
        <div className="flex items-center gap-1 mt-1">
          <CalendarIcon size={11} className="text-zinc-300" />
          <span className="text-xs text-zinc-400">{formatDueDateShort(card.due_date)}</span>
        </div>
      )}
    </div>
  </button>
);

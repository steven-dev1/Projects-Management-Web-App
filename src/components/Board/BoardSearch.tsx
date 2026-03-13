import { CalendarIcon, CheckCircle2, Circle, Search, SearchX } from "lucide-react";
import { CardDetailModal } from "./Cards/CardDetailModal";
import { Card } from "@/store/features/boards/BoardsTypes";
import { Input, useDisclosure } from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { HighlightedText } from "./HighlightedText";

export const BoardSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isOpen: isCardOpen, onOpen: onCardOpen, onClose: onCardClose } = useDisclosure();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const lists = useAppSelector((state) => state.boards.currentBoard?.lists);

  const results = useMemo(() => {
  if (!query.trim() || !lists) return [];
  const q = query.toLowerCase();
  return lists
    .map((list) => ({
      list,
      cards: list.cards.filter(
        (card) =>
          card.title.toLowerCase().includes(q) ||
          card.description?.replace(/<[^>]*>/g, "").toLowerCase().includes(q)
      ),
    }))
    .filter((group) => group.cards.length > 0);
}, [query, lists]);

  const totalResults = results.reduce((acc, g) => acc + g.cards.length, 0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCard = (cardId: string) => {
    setSelectedCardId(cardId);
    onCardOpen();
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      <div ref={containerRef} className="relative w-full max-w-4xl">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.trim().length > 0);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onClear={() => {
            setQuery("");
            setIsOpen(false);
          }}
          placeholder="Buscar tarjetas..."
          size="md"
          startContent={<Search size={16} className="text-zinc-400" />}
          isClearable
        />

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 max-h-125 overflow-y-auto">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-zinc-400">
                <SearchX size={20} />
                <p className="text-sm">Sin resultados para &quot;{query}&quot;</p>
              </div>
            ) : (
              <>
                <div className="px-3 py-2 border-b border-zinc-100">
                  <p className="text-xs text-zinc-400">
                    {totalResults} {totalResults === 1 ? "resultado" : "resultados"}
                  </p>
                </div>
                {results.map(({ list, cards }) => (
                  <div key={list.id}>
                    <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 border-b border-zinc-100">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: list.background_color ?? "#a742ff" }}
                      />
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide truncate">
                        {list.title}
                      </p>
                    </div>
                    {/* Cards de esa lista */}
                    {cards.map((card: Card) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleSelectCard(card.id!)}
                        className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0 text-left"
                      >
                        {card.is_completed ? (
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <Circle size={14} className="text-zinc-300 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium truncate ${card.is_completed ? "line-through text-zinc-400" : "text-zinc-700"}`}>
                            <HighlightedText text={card.title} query={query} />
                          </p>
                          {card.description && (
                            <p className="text-xs text-zinc-400 mt-0.5 truncate">
                              {card.description.replace(/<[^>]*>/g, "")} {/* strip HTML del rich text */}
                            </p>
                          )}
                          {card.due_date && (
                            <div className="flex items-center gap-1 mt-1">
                              <CalendarIcon size={11} className="text-zinc-300" />
                              <span className="text-xs text-zinc-400">
                                {new Date(card.due_date).toLocaleDateString("es-ES", {
                                  day: "numeric", month: "short"
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {selectedCardId && (
        <CardDetailModal
          cardId={selectedCardId}
          isOpen={isCardOpen}
          onClose={() => {
            onCardClose();
            setSelectedCardId(null);
          }}
        />
      )}
    </>
  );
};
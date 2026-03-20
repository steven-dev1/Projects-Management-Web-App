import { Search } from "lucide-react";
import { CardDetailModal } from "./Cards/CardDetailModal";
import { useDisclosure } from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { SearchResults } from "./SearchResults";

export const BoardSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isOpen: isCardOpen, onOpen: onCardOpen, onClose: onCardClose } = useDisclosure();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const lists = useAppSelector((s) => s.boards.currentBoard?.lists);
  const currentBoard = useAppSelector((s) => s.boards.currentBoard);
  const isBoardClosed = currentBoard?.status === "archived";

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
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(e.target.value.trim().length > 0); }}
            onFocus={() => { if (query.trim()) setIsOpen(true); }}
            placeholder="Buscar tarjetas..."
            type="search"
            className="w-full pl-9 outline-none rounded-xl text-sm border p-2.5 dark:border-zinc-800 border-zinc-400"
          />
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 dark:border-zinc-800 border border-zinc-200 rounded-xl shadow-xl z-50 max-h-125 overflow-y-auto">
            <SearchResults
              results={results}
              totalResults={totalResults}
              query={query}
              onSelectCard={handleSelectCard}
            />
          </div>
        )}
      </div>
      {selectedCardId && (
        <CardDetailModal
          isBoardClosed={isBoardClosed}
          cardId={selectedCardId}
          isOpen={isCardOpen}
          onClose={() => { onCardClose(); setSelectedCardId(null); }}
        />
      )}
    </>
  );
};
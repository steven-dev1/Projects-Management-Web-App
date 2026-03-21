import { describe, it, expect, vi, } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import CardView from "@/components/Board/Cards/CardView";
import { BoardResponse, BoardsState, Card } from "@/store/features/boards/BoardsTypes";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({
    from: () => ({}),
  }),
}));


vi.mock("@/components/Board/Cards/CardDetailModal", () => ({
  CardDetailModal: () => <div data-testid="card-detail-modal" />,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeStore = (isBoardClosed = false) =>
  configureStore({
    reducer: { boards: boardsReducer },
    preloadedState: {
      boards: {
        currentBoard: {
          id: "board-1",
          status: isBoardClosed ? "archived" : "active",
          lists: [],
          board_members: [],
          labels: [],
        } as unknown as BoardResponse,
        boards: [],
        currentBoardId: "board-1",
        status: "succeeded",
        error: null,
        searchQuery: "",
      } as BoardsState,
    },
  });

const makeCard = (overrides: Partial<Card> = {}): Card => ({
  id: "card-1",
  title: "Test card",
  list_id: "list-1",
  position: 0,
  is_completed: false,
  labels: [],
  checklists: [],
  ...overrides,
});

const renderCard = (card: Card, isBoardClosed = false) => {
  const store = makeStore(isBoardClosed);
  return render(
    <Provider store={store}>
      <CardView card={card} />
    </Provider>
  );
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("CardView", () => {
  describe("renderizado básico", () => {
    it("debería mostrar el título de la card", () => {
      renderCard(makeCard({ title: "Mi tarea importante" }));
      expect(screen.getByText("Mi tarea importante")).toBeInTheDocument();
    });

    it("debería aplicar line-through si la card está completada", () => {
      renderCard(makeCard({ is_completed: true }));
      const title = screen.getByText("Test card");
      expect(title).toHaveClass("text-zinc-500");
    });

    it("no debería aplicar line-through si la card no está completada", () => {
      renderCard(makeCard({ is_completed: false }));
      const title = screen.getByText("Test card");
      expect(title).not.toHaveClass("text-zinc-500");
    });
  });

  describe("labels", () => {
    it("debería mostrar los labels de la card", () => {
      const card = makeCard({
        labels: [
          { id: "l-1", name: "Bug", color: "#ff0000", board_id: "b-1", created_at: "2026-01-01" },
          { id: "l-2", name: "Feature", color: "#0000ff", board_id: "b-1", created_at: "2026-01-01" },
        ],
      });
      renderCard(card);
      // Los labels se renderizan como divs de color, verificamos que hay 2
      const labelDots = document.querySelectorAll(".h-1\\.5.w-4.rounded-full");
      expect(labelDots).toHaveLength(2);
    });

    it("debería mostrar máximo 3 labels y un contador si hay más", () => {
      const card = makeCard({
        labels: [
          { id: "l-1", name: "Bug", color: "#ff0000", board_id: "b-1", created_at: "2026-01-01" },
          { id: "l-2", name: "Feature", color: "#0000ff", board_id: "b-1", created_at: "2026-01-01" },
          { id: "l-3", name: "Hotfix", color: "#00ff00", board_id: "b-1", created_at: "2026-01-01" },
          { id: "l-4", name: "Extra", color: "#ffff00", board_id: "b-1", created_at: "2026-01-01" },
        ],
      });
      renderCard(card);
      expect(screen.getByText("+1")).toBeInTheDocument();
    });
  });

  describe("descripción", () => {
    it("debería mostrar el ícono de descripción si la card tiene descripción", () => {
      const card = makeCard({ description: "<p>Descripción</p>" });
      renderCard(card);
      // TextInitial icon se renderiza cuando hay descripción
      const descIcon = document.querySelector(".lucide-text-initial");
      expect(descIcon).toBeInTheDocument();
    });

    it("no debería mostrar el ícono de descripción si no hay descripción", () => {
      renderCard(makeCard({ description: undefined }));
      const descIcon = document.querySelector(".lucide-text-initial");
      expect(descIcon).not.toBeInTheDocument();
    });
  });

  describe("fecha límite", () => {
    it("debería mostrar ícono de calendario si tiene due_date", () => {
      const future = new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString();
      renderCard(makeCard({ due_date: future }));
      const calIcon = document.querySelector(".lucide-calendar");
      expect(calIcon).toBeInTheDocument();
    });

    it("debería aplicar color rojo si la fecha está vencida", () => {
      const past = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
      renderCard(makeCard({ due_date: past }));
      const calWrapper = document.querySelector(".text-red-600");
      expect(calWrapper).toBeInTheDocument();
    });

    it("debería aplicar color amarillo si vence pronto", () => {
      const soon = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // 30 min
      renderCard(makeCard({ due_date: soon }));
      const calWrapper = document.querySelector(".text-amber-600");
      expect(calWrapper).toBeInTheDocument();
    });
  });

  describe("board cerrado", () => {
    it("no debería mostrar el checkbox si el board está cerrado", () => {
      renderCard(makeCard(), true);
      const checkbox = document.querySelector("input[type='checkbox']");
      expect(checkbox).not.toBeInTheDocument();
    });

    it("debería mostrar el checkbox si el board está abierto", () => {
      renderCard(makeCard(), false);
      const checkbox = document.querySelector("input[type='checkbox']");
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe("interacción", () => {
    it("debería abrir el modal al hacer click en la card", () => {
      renderCard(makeCard());
      const card = screen.getByText("Test card").closest("div[class*='cursor-pointer']");
      fireEvent.click(card!);
      expect(screen.getByTestId("card-detail-modal")).toBeInTheDocument();
    });
  });
});
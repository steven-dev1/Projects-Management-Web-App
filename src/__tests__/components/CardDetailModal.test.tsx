import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import authReducer from "@/store/features/auth/AuthSlice";
import { CardDetailModal } from "@/components/Board/Cards/CardDetailModal";
import { BoardResponse, BoardsState } from "@/store/features/boards/BoardsTypes";
import { User } from "@supabase/supabase-js";

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({}),
}));

vi.mock("@/lib/actions/createNotification", () => ({
  createNotification: vi.fn(),
}));

vi.mock("@/components/Board/RichTextEditor", () => ({
  RichTextEditor: ({ onSave, onCancel }: { onSave: (v: string) => void; onCancel: () => void }) => (
    <div>
      <button onClick={() => onSave("<p>Nueva descripción</p>")}>Guardar descripción</button>
      <button onClick={onCancel}>Cancelar descripción</button>
    </div>
  ),
}));

const makeStore = (boardStatus: "active" | "archived" = "active") =>
  configureStore({
    reducer: { boards: boardsReducer, auth: authReducer },
    preloadedState: {
      boards: {
        currentBoard: {
          id: "board-1",
          status: boardStatus,
          owner_id: "user-1",
          lists: [
            {
              id: "list-1",
              title: "Test List",
              position: 0,
              board_id: "board-1",
              status: "active",
              created_at: "2026-01-01",
              updated_at: "2026-01-01",
              cards: [
                {
                  id: "card-1",
                  title: "Test card",
                  description: "<p>Descripción original</p>",
                  list_id: "list-1",
                  position: 0,
                  is_completed: false,
                  due_date: null,
                  assigned_to: null,
                  labels: [],
                  checklists: [],
                },
              ],
            },
          ],
          board_members: [],
          labels: [],
        } as unknown as BoardResponse,
        boards: [],
        currentBoardId: "board-1",
        status: "succeeded",
        error: null,
        searchQuery: "",
      } as BoardsState,
      auth: {
        user: { id: "user-1" } as unknown as User,
        profile: null,
        isLoading: false,
        error: null,
        preferences: null,
      },
    },
  });

const renderModal = (isOpen = true, boardStatus: "active" | "archived" = "active") => {
  const store = makeStore(boardStatus);
  const onClose = vi.fn();

  render(
    <Provider store={store}>
      <CardDetailModal cardId="card-1" isOpen={isOpen} onClose={onClose} />
    </Provider>,
  );

  return { onClose, store };
};

describe("CardDetailModal", () => {
  describe("renderizado", () => {
    it("debería mostrar el título de la card", () => {
      renderModal();
      expect(screen.getByText("Test card")).toBeInTheDocument();
    });

    it("debería mostrar el nombre de la lista", () => {
      renderModal();
      expect(screen.getByText("Test List")).toBeInTheDocument();
    });

    it("no debería renderizar nada si la card no existe", () => {
      const store = makeStore();
      const { container } = render(
        <Provider store={store}>
          <CardDetailModal cardId="card-inexistente" isOpen={true} onClose={vi.fn()} />
        </Provider>,
      );
      expect(container).toBeEmptyDOMElement();
    });

    it("no debería renderizar nada si isOpen es false", () => {
      renderModal(false);
      expect(screen.queryByText("Test card")).not.toBeInTheDocument();
    });
  });

  describe("board cerrado", () => {
    it("no debería mostrar el panel de acciones si el board está cerrado", () => {
      renderModal(true, "archived");
      expect(screen.queryByText("Acciones")).not.toBeInTheDocument();
    });

    it("debería mostrar el panel de acciones si el board está abierto", () => {
      renderModal(true, "active");
      expect(screen.getByText("Acciones")).toBeInTheDocument();
    });
  });

  it("debería mostrar un input al hacer click en el título", async () => {
    renderModal();
    const title = screen.getByRole("heading", { name: "Test card" });
    fireEvent.click(title);
    await waitFor(() => {
      // Buscamos el input específico del título por su valor inicial
      expect(screen.getByDisplayValue("Test card")).toBeInTheDocument();
    });
  });

  it("debería cerrar el input al presionar Escape", async () => {
    renderModal();
    const title = screen.getByRole("heading", { name: "Test card" });
    fireEvent.click(title);
    await waitFor(() => screen.getByDisplayValue("Test card"));

    fireEvent.keyDown(screen.getByDisplayValue("Test card"), { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByDisplayValue("Test card")).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Test card" })).toBeInTheDocument();
    });
  });

  // ── cierre del modal ───────────────────────────────────────────────────────

  it("debería llamar onClose al hacer click en el botón de cerrar", async () => {
    const { onClose } = renderModal();

    // HeroUI renderiza el botón de cerrar con aria-label="Close"
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});

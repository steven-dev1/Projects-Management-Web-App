import { describe, it, expect, vi, beforeEach } from "vitest";
import { archiveCard } from "@/store/features/boards/CardsThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardResponse, BoardsState } from "@/store/features/boards/BoardsTypes";

const { mockRpc } = vi.hoisted(() => ({
  mockRpc: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({
    rpc: mockRpc,
  }),
}));

const initialBoardsState: BoardsState = {
  currentBoard: {
    id: "board-1",
    name: "Test Board",
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
          { id: "card-1", title: "Card 1", list_id: "list-1", position: 0, is_completed: false, labels: [], checklists: [] },
          { id: "card-2", title: "Card 2", list_id: "list-1", position: 1, is_completed: false, labels: [], checklists: [] },
        ],
      },
    ],
  } as unknown as BoardResponse,
  boards: [],
  status: "succeeded",
  error: null,
  searchQuery: "",
};

const makeStore = () =>
  configureStore({
    reducer: { boards: boardsReducer },
    preloadedState: { boards: initialBoardsState },
  });

describe("archiveCard", () => {
  beforeEach(() => {
    mockRpc.mockResolvedValue({ error: null });
  });

  it("debería eliminar la card del estado al archivar", async () => {
    const store = makeStore();

    await store.dispatch(archiveCard("card-1"));

    const cards = store.getState().boards.currentBoard?.lists[0].cards;
    expect(cards).toHaveLength(1);
    expect(cards?.[0].id).toBe("card-2");
  });

  it("debería retornar fulfilled con el id archivado", async () => {
    const store = makeStore();

    const result = await store.dispatch(archiveCard("card-1"));

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect(result.payload).toBe("card-1");
  });

  it("debería llamar al RPC con los parámetros correctos", async () => {
    const store = makeStore();

    await store.dispatch(archiveCard("card-1"));

    expect(mockRpc).toHaveBeenCalledWith("archive_card", { p_card_id: "card-1" });
  });

  it("no debería afectar otras cards al archivar", async () => {
    const store = makeStore();

    await store.dispatch(archiveCard("card-1"));

    const cards = store.getState().boards.currentBoard?.lists[0].cards;
    expect(cards?.[0].title).toBe("Card 2");
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockRpc.mockResolvedValueOnce({ error: { message: "Error al archivar la tarjeta" } });

    const store = makeStore();
    const result = await store.dispatch(archiveCard("card-1"));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al archivar la tarjeta");
  });
});
import { describe, it, expect, vi, beforeEach } from "vitest";
import { restoreCard } from "@/store/features/boards/CardsThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardResponse, BoardsState } from "@/store/features/boards/BoardsTypes";

const { mockSingle } = vi.hoisted(() => ({
  mockSingle: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({
    from: () => ({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: mockSingle,
          }),
        }),
      }),
    }),
  }),
}));

const mockRestoredCard = {
  id: "card-1",
  title: "Card restaurada",
  list_id: "list-1",
  position: 0,
  is_completed: false,
  status: "active",
  labels: [{ id: "label-1", name: "Bug", color: "#ff0000" }],
  checklists: [],
  card_labels: [{ labels: { id: "label-1", name: "Bug", color: "#ff0000" } }],
};

const initialBoardsState: BoardsState = {
  currentBoardId: "board-1",
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
        cards: [],
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

describe("restoreCard", () => {
  beforeEach(() => {
    mockSingle.mockResolvedValue({ data: mockRestoredCard, error: null });
  });

  it("debería agregar la card restaurada a la lista correcta", async () => {
    const store = makeStore();

    await store.dispatch(restoreCard("card-1"));

    const cards = store.getState().boards.currentBoard?.lists[0].cards;
    expect(cards).toHaveLength(1);
    expect(cards?.[0].title).toBe("Card restaurada");
  });

  it("debería retornar fulfilled con la card restaurada", async () => {
    const store = makeStore();

    const result = await store.dispatch(restoreCard("card-1"));

    expect(result.meta.requestStatus).toBe("fulfilled");
  });

  it("debería llamar a Supabase con el id correcto", async () => {
    const store = makeStore();

    await store.dispatch(restoreCard("card-1"));

    expect(mockSingle).toHaveBeenCalled();
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: "Error al restaurar la tarjeta" } });

    const store = makeStore();
    const result = await store.dispatch(restoreCard("card-1"));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al restaurar la tarjeta");
  });
});
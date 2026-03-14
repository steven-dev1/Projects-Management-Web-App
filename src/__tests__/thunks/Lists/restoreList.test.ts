import { describe, it, expect, vi, beforeEach } from "vitest";
import { restoreList } from "@/store/features/boards/ListsThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardList, BoardResponse, BoardsState } from "@/store/features/boards/BoardsTypes";

const { mockSingle, mockEq } = vi.hoisted(() => ({
  mockSingle: vi.fn(),
  mockEq: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({
    from: () => ({
      update: () => ({
        eq: mockEq,
      }),
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: mockSingle,
          }),
        }),
      }),
    }),
  }),
}));

const mockRestoredList = {
  id: "list-1",
  title: "Lista restaurada",
  position: 0,
  board_id: "board-1",
  status: "active",
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
  cards: [],
} as unknown as BoardList;

const initialBoardsState: BoardsState = {
  currentBoard: {
    id: "board-1",
    name: "Test Board",
    lists: [],
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

describe("restoreList", () => {
  beforeEach(() => {
    mockEq.mockResolvedValue({ error: null });
    mockSingle.mockResolvedValue({ data: mockRestoredList, error: null });
  });

  it("debería agregar la lista restaurada al board", async () => {
    const store = makeStore();

    await store.dispatch(restoreList("list-1"));

    const lists = store.getState().boards.currentBoard?.lists;
    expect(lists).toHaveLength(1);
    expect(lists?.[0].title).toBe("Lista restaurada");
  });

  it("debería retornar fulfilled con la lista restaurada", async () => {
    const store = makeStore();

    const result = await store.dispatch(restoreList("list-1"));

    expect(result.meta.requestStatus).toBe("fulfilled");
  });

  it("debería retornar rejected si el update falla", async () => {
    mockEq.mockResolvedValueOnce({ error: { message: "Error al restaurar la lista" } });

    const store = makeStore();
    const result = await store.dispatch(restoreList("list-1"));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al restaurar la lista");
  });

  it("debería retornar rejected si el fetch falla", async () => {
    mockEq.mockResolvedValueOnce({ error: null });
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: "Error al obtener la lista" } });

    const store = makeStore();
    const result = await store.dispatch(restoreList("list-1"));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al obtener la lista");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchBoardById } from "@/store/features/boards/BoardsThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardResponse, BoardsState } from "@/store/features/boards/BoardsTypes";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({
    from: () => ({}),
  }),
}));

const mockBoard: Partial<BoardResponse> = {
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
        {
          id: "card-1",
          title: "Test card",
          list_id: "list-1",
          position: 0,
          is_completed: false,
          labels: [],
          checklists: [],
        },
      ],
    },
  ],
  board_members: [],
  labels: [],
};

const initialBoardsState: BoardsState = {
  currentBoard: null,
  currentBoardId: null,
  boards: [],
  status: "idle",
  error: null,
  searchQuery: "",
};

const makeStore = () =>
  configureStore({
    reducer: { boards: boardsReducer },
    preloadedState: { boards: initialBoardsState },
  });

describe("fetchBoardById", () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBoard),
    });
  });

  it("debería cargar el board en currentBoard", async () => {
    const store = makeStore();
    await store.dispatch(fetchBoardById("board-1"));

    const currentBoard = store.getState().boards.currentBoard;
    expect(currentBoard?.id).toBe("board-1");
    expect(currentBoard?.name).toBe("Test Board");
  });

  it("debería cargar las listas del board", async () => {
    const store = makeStore();
    await store.dispatch(fetchBoardById("board-1"));

    const lists = store.getState().boards.currentBoard?.lists;
    expect(lists).toHaveLength(1);
    expect(lists?.[0].title).toBe("Test List");
  });

  it("debería cargar las cards de las listas", async () => {
    const store = makeStore();
    await store.dispatch(fetchBoardById("board-1"));

    const cards = store.getState().boards.currentBoard?.lists[0].cards;
    expect(cards).toHaveLength(1);
    expect(cards?.[0].title).toBe("Test card");
  });

  it("debería llamar al endpoint correcto", async () => {
    const store = makeStore();
    await store.dispatch(fetchBoardById("board-1"));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/boards/board-1",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("debería retornar fulfilled con el board", async () => {
    const store = makeStore();
    const result = await store.dispatch(fetchBoardById("board-1"));

    expect(result.meta.requestStatus).toBe("fulfilled");
  });

  it("debería retornar rejected si la API falla", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Board no encontrado" }),
    });

    const store = makeStore();
    const result = await store.dispatch(fetchBoardById("board-1"));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Board no encontrado");
  });

  it("debería retornar rejected si fetch lanza un error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const store = makeStore();
    const result = await store.dispatch(fetchBoardById("board-1"));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Network error");
  });
});

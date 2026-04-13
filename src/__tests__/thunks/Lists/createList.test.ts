import { describe, it, expect, vi, beforeEach } from "vitest";
import { createList } from "@/store/features/boards/ListsThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardResponse, BoardsState } from "@/store/features/boards/BoardsTypes";

const { mockSingle } = vi.hoisted(() => ({
  mockSingle: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({
    from: () => ({
      insert: () => ({
        select: () => ({
          single: mockSingle,
        }),
      }),
    }),
  }),
}));

const mockList = {
  id: "list-1",
  title: "Nueva lista",
  board_id: "board-1",
  position: 0,
  background_color: null,
  status: "active",
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
  cards: [],
};

const initialBoardsState: BoardsState = {
  currentBoardId: "board-1",
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

describe("createList", () => {
  beforeEach(() => {
    mockSingle.mockResolvedValue({ data: mockList, error: null });
  });

  it("debería agregar la lista al board", async () => {
    const store = makeStore();

    await store.dispatch(createList({
      title: "Nueva lista",
      board_id: "board-1",
      position: 0,
    }));

    const lists = store.getState().boards.currentBoard?.lists;
    expect(lists).toHaveLength(1);
    expect(lists?.[0].title).toBe("Nueva lista");
  });

  it("debería agregar la lista con cards vacías", async () => {
    const store = makeStore();

    await store.dispatch(createList({
      title: "Nueva lista",
      board_id: "board-1",
      position: 0,
    }));

    const list = store.getState().boards.currentBoard?.lists[0];
    expect(list?.cards).toEqual([]);
  });

  it("debería agregar la lista en la posición correcta", async () => {
    mockSingle.mockResolvedValueOnce({ data: { ...mockList, position: 2 }, error: null });

    const store = makeStore();

    await store.dispatch(createList({
      title: "Nueva lista",
      board_id: "board-1",
      position: 2,
    }));

    const list = store.getState().boards.currentBoard?.lists[0];
    expect(list?.position).toBe(2);
  });

  it("debería retornar fulfilled con la lista creada", async () => {
    const store = makeStore();

    const result = await store.dispatch(createList({
      title: "Nueva lista",
      board_id: "board-1",
      position: 0,
    }));

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect((result.payload as unknown as typeof mockList).id).toBe("list-1");
  });

  it("debería llamar a Supabase con los parámetros correctos", async () => {
    const store = makeStore();

    await store.dispatch(createList({
      title: "Nueva lista",
      board_id: "board-1",
      position: 0,
    }));

    expect(mockSingle).toHaveBeenCalled();
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: "Error al crear la lista" } });

    const store = makeStore();
    const result = await store.dispatch(createList({
      title: "Nueva lista",
      board_id: "board-1",
      position: 0,
    }));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al crear la lista");
  });
});
import { describe, it, expect, vi, beforeEach } from "vitest";
import { archiveList } from "@/store/features/boards/ListsThunks";
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
  currentBoardId: "board-1",
  currentBoard: {
    id: "board-1",
    name: "Test Board",
    lists: [
      {
        id: "list-1",
        title: "Lista 1",
        position: 0,
        board_id: "board-1",
        status: "active",
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
        cards: [],
      },
      {
        id: "list-2",
        title: "Lista 2",
        position: 1,
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

describe("archiveList", () => {
  beforeEach(() => {
    mockRpc.mockResolvedValue({ error: null });
  });

  it("debería eliminar la lista del estado al archivar", async () => {
    const store = makeStore();

    await store.dispatch(archiveList("list-1"));

    const lists = store.getState().boards.currentBoard?.lists;
    expect(lists).toHaveLength(1);
    expect(lists?.[0].id).toBe("list-2");
  });

  it("no debería afectar otras listas al archivar", async () => {
    const store = makeStore();

    await store.dispatch(archiveList("list-1"));

    const lists = store.getState().boards.currentBoard?.lists;
    expect(lists?.[0].title).toBe("Lista 2");
  });

  it("debería retornar fulfilled con el id archivado", async () => {
    const store = makeStore();

    const result = await store.dispatch(archiveList("list-1"));

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect(result.payload).toBe("list-1");
  });

  it("debería llamar al RPC con los parámetros correctos", async () => {
    const store = makeStore();

    await store.dispatch(archiveList("list-1"));

    expect(mockRpc).toHaveBeenCalledWith("archive_list", { p_list_id: "list-1" });
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockRpc.mockResolvedValueOnce({ error: { message: "Error al archivar la lista" } });

    const store = makeStore();
    const result = await store.dispatch(archiveList("list-1"));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al archivar la lista");
  });
});

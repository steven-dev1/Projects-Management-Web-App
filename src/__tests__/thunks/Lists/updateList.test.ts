import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateList } from "@/store/features/boards/ListsThunks";
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
        title: "Título original",
        position: 0,
        board_id: "board-1",
        status: "active",
        background_color: null,
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

describe("updateList", () => {
  beforeEach(() => {
    mockRpc.mockResolvedValue({
      data: { id: "list-1", title: "Título actualizado", background_color: "#ff0000" },
      error: null,
    });
  });

  it("debería actualizar el título de la lista", async () => {
    const store = makeStore();

    await store.dispatch(updateList({ listId: "list-1", title: "Título actualizado" }));

    const list = store.getState().boards.currentBoard?.lists[0];
    expect(list?.title).toBe("Título actualizado");
  });

  it("debería actualizar el background_color de la lista", async () => {
    const store = makeStore();

    await store.dispatch(updateList({ listId: "list-1", title: "Título actualizado", background_color: "#ff0000" }));

    const list = store.getState().boards.currentBoard?.lists[0];
    expect(list?.background_color).toBe("#ff0000");
  });

  it("debería retornar fulfilled con la lista actualizada", async () => {
    const store = makeStore();

    const result = await store.dispatch(updateList({ listId: "list-1", title: "Título actualizado" }));

    expect(result.meta.requestStatus).toBe("fulfilled");
  });

  it("debería llamar al RPC con los parámetros correctos", async () => {
    const store = makeStore();

    await store.dispatch(updateList({ listId: "list-1", title: "Título actualizado", background_color: "#ff0000" }));

    expect(mockRpc).toHaveBeenCalledWith("update_list", {
      p_list_id: "list-1",
      p_title: "Título actualizado",
      p_background_color: "#ff0000",
    });
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: { message: "Error al actualizar la lista" } });

    const store = makeStore();
    const result = await store.dispatch(updateList({ listId: "list-1", title: "Título actualizado" }));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al actualizar la lista");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateListOrderSupabase } from "@/store/features/boards/ListsThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardsState } from "@/store/features/boards/BoardsTypes";

const { mockRpc } = vi.hoisted(() => ({
  mockRpc: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({
    rpc: mockRpc,
  }),
}));

const initialBoardsState: BoardsState = {
  currentBoard: null,
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

describe("updateListOrderSupabase", () => {
  beforeEach(() => {
    mockRpc.mockResolvedValue({ error: null });
  });

  it("debería retornar fulfilled cuando Supabase responde correctamente", async () => {
    const store = makeStore();

    const result = await store.dispatch(
      updateListOrderSupabase({
        listId: "list-1",
        newIndex: 2,
        boardId: "board-1",
      }),
    );

    expect(result.meta.requestStatus).toBe("fulfilled");
  });

  it("debería llamar al RPC con los parámetros correctos", async () => {
    const store = makeStore();

    await store.dispatch(
      updateListOrderSupabase({
        listId: "list-1",
        newIndex: 2,
        boardId: "board-1",
      }),
    );

    expect(mockRpc).toHaveBeenCalledWith("update_list_positions", {
      p_list_id: "list-1",
      p_new_position: 2,
      p_board_id: "board-1",
    });
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockRpc.mockResolvedValueOnce({ error: { message: "Error al reordenar listas" } });

    const store = makeStore();
    const result = await store.dispatch(
      updateListOrderSupabase({
        listId: "list-1",
        newIndex: 2,
        boardId: "board-1",
      }),
    );

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al reordenar listas");
  });
});

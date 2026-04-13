import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateCardOrder } from "@/store/features/boards/CardsThunks";
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
  currentBoardId: null,
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

describe("updateCardOrder", () => {
  beforeEach(() => {
    mockRpc.mockResolvedValue({ data: null, error: null });
  });

  it("debería retornar fulfilled cuando Supabase responde correctamente", async () => {
    const store = makeStore();

    const result = await store.dispatch(
      updateCardOrder({
        cardId: "card-1",
        newListId: "list-2",
        newIndex: 0,
        oldListId: "list-1",
      }),
    );

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect(result.payload).toEqual({ success: true, data: null });
  });

  it("debería llamar al RPC con los parámetros correctos", async () => {
    const store = makeStore();

    await store.dispatch(
      updateCardOrder({
        cardId: "card-1",
        newListId: "list-2",
        newIndex: 2,
        oldListId: "list-1",
      }),
    );

    expect(mockRpc).toHaveBeenCalledWith("update_card_positions", {
      p_card_id: "card-1",
      p_new_list_id: "list-2",
      p_new_position: 2,
      p_old_list_id: "list-1",
    });
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: { message: "Error al actualizar posición" } });

    const store = makeStore();
    const result = await store.dispatch(
      updateCardOrder({
        cardId: "card-1",
        newListId: "list-2",
        newIndex: 0,
        oldListId: "list-1",
      }),
    );

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al actualizar posición");
  });
  it("debería retornar los datos que devuelve el RPC", async () => {
    mockRpc.mockResolvedValueOnce({ data: { updated: 2 }, error: null });

    const store = makeStore();
    const result = await store.dispatch(
      updateCardOrder({
        cardId: "card-1",
        newListId: "list-2",
        newIndex: 0,
        oldListId: "list-1",
      }),
    );

    expect(result.payload).toEqual({ success: true, data: { updated: 2 } });
  });
  it("debería retornar fulfilled aunque data sea null", async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: null });

    const store = makeStore();
    const result = await store.dispatch(
      updateCardOrder({
        cardId: "card-1",
        newListId: "list-2",
        newIndex: 0,
        oldListId: "list-1",
      }),
    );

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect(result.payload).toEqual({ success: true, data: null });
  });
});

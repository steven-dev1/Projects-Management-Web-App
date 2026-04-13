import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteBoard } from "@/store/features/boards/BoardsThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardResponse, BoardsState } from "@/store/features/boards/BoardsTypes";

const { mockEq } = vi.hoisted(() => ({
  mockEq: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({
    from: () => ({
      delete: () => ({
        eq: mockEq,
      }),
    }),
  }),
}));

const initialBoardsState: BoardsState = {
  currentBoardId: null,
  currentBoard: null,
  boards: [
    { id: "board-1", name: "Board 1", status: "active" } as unknown as BoardResponse,
    { id: "board-2", name: "Board 2", status: "active" } as unknown as BoardResponse,
  ],
  status: "succeeded",
  error: null,
  searchQuery: "",
};

const makeStore = () =>
  configureStore({
    reducer: { boards: boardsReducer },
    preloadedState: { boards: initialBoardsState },
  });

describe("deleteBoard", () => {
  beforeEach(() => {
    mockEq.mockResolvedValue({ error: null });
  });

  it("debería eliminar el board del estado", async () => {
    const store = makeStore();

    await store.dispatch(deleteBoard("board-1"));

    const boards = store.getState().boards.boards;
    expect(boards).toHaveLength(1);
    expect(boards[0].id).toBe("board-2");
  });

  it("no debería afectar otros boards al eliminar", async () => {
    const store = makeStore();

    await store.dispatch(deleteBoard("board-1"));

    const boards = store.getState().boards.boards;
    expect(boards[0].name).toBe("Board 2");
  });

  it("debería retornar fulfilled con el id eliminado", async () => {
    const store = makeStore();

    const result = await store.dispatch(deleteBoard("board-1"));

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect(result.payload).toBe("board-1");
  });

  it("debería llamar a Supabase con el id correcto", async () => {
    const store = makeStore();

    await store.dispatch(deleteBoard("board-1"));

    expect(mockEq).toHaveBeenCalledWith("id", "board-1");
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockEq.mockResolvedValueOnce({ error: { message: "Error al eliminar el tablero" } });

    const store = makeStore();
    const result = await store.dispatch(deleteBoard("board-1"));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al eliminar el tablero");
  });
});
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createBoard } from "@/store/features/boards/BoardsThunks";
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

const mockBoard = {
  id: "board-1",
  name: "Mi board",
  description: "Descripción",
  owner_id: "user-1",
  status: "active",
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
  background_color: null,
  lists: [],
  board_members: [],
  labels: [],
};

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

describe("createBoard", () => {
  beforeEach(() => {
    mockRpc.mockResolvedValue({ data: mockBoard, error: null });
  });

  it("debería agregar el board al estado después de crearlo", async () => {
    const store = makeStore();

    await store.dispatch(createBoard({ name: "Mi board", description: "Descripción" }));

    const boards = store.getState().boards.boards;
    expect(boards).toHaveLength(1);
    expect(boards[0].name).toBe("Mi board");
  });

  it("debería retornar fulfilled con el board creado", async () => {
    const store = makeStore();

    const result = await store.dispatch(createBoard({ name: "Mi board", description: "Descripción" }));

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect((result.payload as unknown as typeof mockBoard).id).toBe("board-1");
  });

  it("debería retornar rejected si el nombre está vacío", async () => {
    const store = makeStore();
    const result = await store.dispatch(createBoard({ name: "" }));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("El nombre del tablero es obligatorio");
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: { message: "Error de base de datos" } });

    const store = makeStore();
    const result = await store.dispatch(createBoard({ name: "Mi board" }));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error de base de datos");
  });
  it("debería llamar al RPC con los parámetros correctos", async () => {
    const store = makeStore();
    await store.dispatch(createBoard({ name: "Mi board", description: "Descripción" }));

    expect(mockRpc).toHaveBeenCalledWith("create_board_with_owner", {
      board_name: "Mi board",
      board_description: "Descripción",
    });
  });

  it("debería usar null como description si no se pasa", async () => {
    const store = makeStore();
    await store.dispatch(createBoard({ name: "Mi board" }));

    expect(mockRpc).toHaveBeenCalledWith("create_board_with_owner", {
      board_name: "Mi board",
      board_description: null,
    });
  });
});

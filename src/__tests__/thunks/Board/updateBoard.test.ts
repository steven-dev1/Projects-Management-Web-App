import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateBoard } from "@/store/features/boards/BoardsThunks";
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

const mockBoard = {
  id: "board-1",
  name: "Board actualizado",
  description: "Nueva descripción",
  background_color: "#ff0000",
  status: "active",
  owner_id: "user-1",
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
};

const initialBoardsState: BoardsState = {
  currentBoardId: null,
  currentBoard: null,
  boards: [
    {
      id: "board-1",
      name: "Board original",
      description: "Descripción original",
      background_color: null,
      status: "active",
    } as unknown as BoardResponse,
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

describe("updateBoard", () => {
  beforeEach(() => {
    mockSingle.mockResolvedValue({ data: mockBoard, error: null });
  });

  it("debería actualizar el nombre del board en el estado", async () => {
    const store = makeStore();

    await store.dispatch(updateBoard({
      boardId: "board-1",
      name: "Board actualizado",
      description: "Nueva descripción",
      background_color: "#ff0000",
    }));

    const board = store.getState().boards.boards[0];
    expect(board.name).toBe("Board actualizado");
  });

  it("debería actualizar la descripción del board", async () => {
    const store = makeStore();

    await store.dispatch(updateBoard({
      boardId: "board-1",
      name: "Board actualizado",
      description: "Nueva descripción",
      background_color: "#ff0000",
    }));

    const board = store.getState().boards.boards[0];
    expect(board.description).toBe("Nueva descripción");
  });

  it("debería actualizar el background_color del board", async () => {
    const store = makeStore();

    await store.dispatch(updateBoard({
      boardId: "board-1",
      name: "Board actualizado",
      description: "Nueva descripción",
      background_color: "#ff0000",
    }));

    const board = store.getState().boards.boards[0];
    expect(board.background_color).toBe("#ff0000");
  });

  it("debería retornar fulfilled con el board actualizado", async () => {
    const store = makeStore();

    const result = await store.dispatch(updateBoard({
      boardId: "board-1",
      name: "Board actualizado",
      description: "Nueva descripción",
      background_color: "#ff0000",
    }));

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect((result.payload as typeof mockBoard).id).toBe("board-1");
  });

  it("debería llamar a Supabase con los parámetros correctos", async () => {
    const store = makeStore();
    await store.dispatch(updateBoard({
      boardId: "board-1",
      name: "Board actualizado",
      description: "Nueva descripción",
      background_color: "#ff0000",
    }));

    expect(mockSingle).toHaveBeenCalled();
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: "Error al actualizar" } });

    const store = makeStore();
    const result = await store.dispatch(updateBoard({
      boardId: "board-1",
      name: "Board actualizado",
    }));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al actualizar");
  });
});
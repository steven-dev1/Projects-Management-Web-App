import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchBoards } from "@/store/features/boards/BoardsThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardsState } from "@/store/features/boards/BoardsTypes";

const { mockGetUser, mockOrder } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockEq: vi.fn(),
  mockOrder: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: mockOrder,
          }),
        }),
      }),
    }),
  }),
}));

const mockBoards = [
  { id: "board-1", name: "Board 1", status: "active", lists: [], board_members: [] },
  { id: "board-2", name: "Board 2", status: "active", lists: [], board_members: [] },
];

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

describe("fetchBoards", () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockOrder.mockResolvedValue({ data: mockBoards, error: null });
  });

  it("debería cargar los boards en el estado", async () => {
    const store = makeStore();
    await store.dispatch(fetchBoards());

    const boards = store.getState().boards.boards;
    expect(boards).toHaveLength(2);
    expect(boards[0].name).toBe("Board 1");
    expect(boards[1].name).toBe("Board 2");
  });

  it("debería retornar fulfilled con los boards", async () => {
    const store = makeStore();
    const result = await store.dispatch(fetchBoards());

    expect(result.meta.requestStatus).toBe("fulfilled");
  });

  it("debería retornar rejected si el usuario no está autenticado", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const store = makeStore();
    const result = await store.dispatch(fetchBoards());

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("No autenticado");
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockOrder.mockResolvedValueOnce({ data: null, error: { message: "Error de base de datos" } });

    const store = makeStore();
    const result = await store.dispatch(fetchBoards());

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error de base de datos");
  });

  it("debería cambiar el status a loading mientras carga", async () => {
    const store = makeStore();
    const promise = store.dispatch(fetchBoards());

    expect(store.getState().boards.status).toBe("loading");
    await promise;
    expect(store.getState().boards.status).toBe("succeeded");
  });
});
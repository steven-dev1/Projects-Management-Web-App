import { describe, it, expect, vi, beforeEach } from "vitest";
import { toggleCardCompletion } from "@/store/features/boards/CardsThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardResponse, BoardsState } from "@/store/features/boards/BoardsTypes";

const mockEq = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({
    from: () => ({
      update: () => ({
        eq: mockEq,
      }),
    }),
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
        title: "Test List",
        cards: [
          {
            id: "card-1",
            title: "Test card",
            is_completed: false,
            labels: [{ id: "label-1", name: "Bug", color: "#ff0000" }],
            checklists: [],
          },
        ],
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

describe("toggleCardCompletion", () => {
  beforeEach(() => {
    mockEq.mockResolvedValue({ error: null });
  });

  it("Debería marcar una card como completada", async () => {
    const store = makeStore();
    await store.dispatch(toggleCardCompletion("card-1"));
    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.is_completed).toBe(true);
  });

  it("Debería preservar los labels al completar", async () => {
    const store = makeStore();
    await store.dispatch(toggleCardCompletion("card-1"));
    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.labels).toHaveLength(1);
    expect(card?.labels?.[0].name).toBe("Bug");
  });

  it("Debería retornar rejected si Supabase falla", async () => {
    mockEq.mockResolvedValueOnce({ error: { message: "Error de base de datos" } });
    const store = makeStore();
    const result = await store.dispatch(toggleCardCompletion("card-1"));
    expect(result.meta.requestStatus).toBe("rejected");
  });
  it("Debería desmarcar una card ya completada", async () => {
    const completedState: BoardsState = {
      ...initialBoardsState,
      currentBoard: {
        ...initialBoardsState.currentBoard,
        lists: [
          {
            ...initialBoardsState.currentBoard!.lists[0],
            cards: [
              {
                ...initialBoardsState.currentBoard!.lists[0].cards[0],
                is_completed: true,
              },
            ],
          },
        ],
      } as unknown as BoardResponse,
    };

    const store = configureStore({
      reducer: { boards: boardsReducer },
      preloadedState: { boards: completedState },
    });

    await store.dispatch(toggleCardCompletion("card-1"));

    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.is_completed).toBe(false);
  });

  it("Debería llamar a Supabase con los parámetros correctos", async () => {
    const store = makeStore();
    await store.dispatch(toggleCardCompletion("card-1"));

    expect(mockEq).toHaveBeenCalledWith("id", "card-1");
  });
});

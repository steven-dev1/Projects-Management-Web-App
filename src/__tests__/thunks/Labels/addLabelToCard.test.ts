import { describe, it, expect, vi, beforeEach } from "vitest";
import { addLabelToCard } from "@/store/features/boards/LabelsThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardResponse, BoardsState } from "@/store/features/boards/BoardsTypes";

const { mockInsert } = vi.hoisted(() => ({
  mockInsert: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({
    from: () => ({
      insert: mockInsert,
    }),
  }),
}));

const mockLabel = { 
  id: "label-1", 
  name: "Bug", 
  color: "#ff0000",
  board_id: "board-1",
  created_at: "2026-01-01",
};

const initialBoardsState: BoardsState = {
  currentBoard: {
    id: "board-1",
    name: "Test Board",
    lists: [
      {
        id: "list-1",
        title: "Test List",
        position: 0,
        board_id: "board-1",
        status: "active",
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
        cards: [
          {
            id: "card-1",
            title: "Test card",
            list_id: "list-1",
            position: 0,
            is_completed: false,
            labels: [],
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

describe("addLabelToCard", () => {
  beforeEach(() => {
    mockInsert.mockResolvedValue({ error: null });
  });

  it("debería agregar el label a la card", async () => {
    const store = makeStore();

    await store.dispatch(addLabelToCard({ cardId: "card-1", label: mockLabel }));

    const labels = store.getState().boards.currentBoard?.lists[0].cards[0].labels;
    expect(labels).toHaveLength(1);
    expect(labels?.[0].name).toBe("Bug");
  });

  it("debería retornar fulfilled con cardId y label", async () => {
    const store = makeStore();

    const result = await store.dispatch(addLabelToCard({ cardId: "card-1", label: mockLabel }));

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect(result.payload).toEqual({ cardId: "card-1", label: mockLabel });
  });

  it("no debería duplicar labels al agregar el mismo", async () => {
    const stateWithLabel: BoardsState = {
      ...initialBoardsState,
      currentBoard: {
        ...initialBoardsState.currentBoard,
        lists: [
          {
            ...initialBoardsState.currentBoard!.lists[0],
            cards: [
              {
                ...initialBoardsState.currentBoard!.lists[0].cards[0],
                labels: [mockLabel],
              },
            ],
          },
        ],
      } as unknown as BoardResponse,
    };

    const store = configureStore({
      reducer: { boards: boardsReducer },
      preloadedState: { boards: stateWithLabel },
    });

    await store.dispatch(addLabelToCard({ cardId: "card-1", label: mockLabel }));

    const labels = store.getState().boards.currentBoard?.lists[0].cards[0].labels;
    expect(labels).toHaveLength(1);
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: "Error al agregar etiqueta" } });

    const store = makeStore();
    const result = await store.dispatch(addLabelToCard({ cardId: "card-1", label: mockLabel }));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al agregar etiqueta");
  });
});
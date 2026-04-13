import { describe, it, expect, vi, beforeEach } from "vitest";
import { assignCard } from "@/store/features/boards/CardsThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardResponse, BoardsState } from "@/store/features/boards/BoardsTypes";

const mockSingle = vi.fn();

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
            assigned_to: null,
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

describe("assignCard", () => {
  beforeEach(() => {
    mockSingle.mockResolvedValue({
      data: { id: "card-1", assigned_to: "user-1" },
      error: null,
    });
  });

  it("debería asignar un usuario a una card", async () => {
    const store = makeStore();

    await store.dispatch(assignCard({ cardId: "card-1", userId: "user-1" }));

    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.assigned_to).toBe("user-1");
  });

  it("debería preservar los labels al asignar", async () => {
    const store = makeStore();

    await store.dispatch(assignCard({ cardId: "card-1", userId: "user-1" }));

    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.labels).toHaveLength(1);
    expect(card?.labels?.[0].name).toBe("Bug");
  });

  it("debería desasignar un usuario pasando null", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: "card-1", assigned_to: null },
      error: null,
    });

    const store = makeStore();
    await store.dispatch(assignCard({ cardId: "card-1", userId: null }));

    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.assigned_to).toBeNull();
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "Error al asignar" },
    });

    const store = makeStore();
    const result = await store.dispatch(assignCard({ cardId: "card-1", userId: "user-1" }));

    expect(result.meta.requestStatus).toBe("rejected");
  });
  it("debería llamar a Supabase con los parámetros correctos al asignar", async () => {
    const store = makeStore();
    await store.dispatch(assignCard({ cardId: "card-1", userId: "user-1" }));
    expect(mockSingle).toHaveBeenCalled();
  });

  it("debería preservar checklists al asignar", async () => {
    const stateWithChecklists: BoardsState = {
      ...initialBoardsState,
      currentBoard: {
        ...initialBoardsState.currentBoard,
        lists: [
          {
            ...initialBoardsState.currentBoard!.lists[0],
            cards: [
              {
                ...initialBoardsState.currentBoard!.lists[0].cards[0],
                checklists: [{ id: "checklist-1", card_id: "card-1", title: "Test", position: 0, items: [] }],
              },
            ],
          },
        ],
      } as unknown as BoardResponse,
    };

    const store = configureStore({
      reducer: { boards: boardsReducer },
      preloadedState: { boards: stateWithChecklists },
    });

    await store.dispatch(assignCard({ cardId: "card-1", userId: "user-1" }));

    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.checklists).toHaveLength(1);
  });
});

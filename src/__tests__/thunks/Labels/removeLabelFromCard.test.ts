import { describe, it, expect, vi, beforeEach } from "vitest";
import { removeLabelFromCard } from "@/store/features/boards/LabelsThunks";
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
        eq: () => ({
          eq: mockEq,
        }),
      }),
    }),
  }),
}));

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
            labels: [
              { id: "label-1", name: "Bug", color: "#ff0000" },
              { id: "label-2", name: "Feature", color: "#0000ff" },
            ],
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

describe("removeLabelFromCard", () => {
  beforeEach(() => {
    mockEq.mockResolvedValue({ error: null });
  });

  it("debería quitar el label de la card", async () => {
    const store = makeStore();

    await store.dispatch(removeLabelFromCard({ cardId: "card-1", labelId: "label-1" }));

    const labels = store.getState().boards.currentBoard?.lists[0].cards[0].labels;
    expect(labels).toHaveLength(1);
    expect(labels?.[0].id).toBe("label-2");
  });

  it("no debería afectar otros labels al quitar uno", async () => {
    const store = makeStore();

    await store.dispatch(removeLabelFromCard({ cardId: "card-1", labelId: "label-1" }));

    const labels = store.getState().boards.currentBoard?.lists[0].cards[0].labels;
    expect(labels?.[0].name).toBe("Feature");
  });

  it("debería retornar fulfilled con cardId y labelId", async () => {
    const store = makeStore();

    const result = await store.dispatch(removeLabelFromCard({ cardId: "card-1", labelId: "label-1" }));

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect(result.payload).toEqual({ cardId: "card-1", labelId: "label-1" });
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockEq.mockResolvedValueOnce({ error: { message: "Error al quitar etiqueta" } });

    const store = makeStore();
    const result = await store.dispatch(removeLabelFromCard({ cardId: "card-1", labelId: "label-1" }));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al quitar etiqueta");
  });
});
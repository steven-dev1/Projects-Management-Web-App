import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteChecklist } from "@/store/features/boards/ChecklistThunks";
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
            labels: [],
            checklists: [
              {
                id: "checklist-1",
                card_id: "card-1",
                title: "Mi checklist",
                position: 0,
                items: [],
              },
              {
                id: "checklist-2",
                card_id: "card-1",
                title: "Otro checklist",
                position: 1,
                items: [],
              },
            ],
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

describe("deleteChecklist", () => {
  beforeEach(() => {
    mockEq.mockResolvedValue({ error: null });
  });

  it("debería eliminar el checklist de la card", async () => {
    const store = makeStore();

    await store.dispatch(deleteChecklist({ checklistId: "checklist-1", cardId: "card-1" }));

    const checklists = store.getState().boards.currentBoard?.lists[0].cards[0].checklists;

    expect(checklists).toHaveLength(1);
    expect(checklists?.[0].id).toBe("checklist-2");
  });

  it("debería retornar fulfilled con checklistId y cardId", async () => {
    const store = makeStore();

    const result = await store.dispatch(deleteChecklist({ checklistId: "checklist-1", cardId: "card-1" }));

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect(result.payload).toEqual({ checklistId: "checklist-1", cardId: "card-1" });
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockEq.mockResolvedValueOnce({ error: { message: "Error al eliminar checklist" } });

    const store = makeStore();
    const result = await store.dispatch(deleteChecklist({ checklistId: "checklist-1", cardId: "card-1" }));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al eliminar checklist");
  });
  it("debería llamar a Supabase con el id correcto", async () => {
    const store = makeStore();
    await store.dispatch(deleteChecklist({ checklistId: "checklist-1", cardId: "card-1" }));
    expect(mockEq).toHaveBeenCalledWith("id", "checklist-1");
  });

  it("no debería afectar otros checklists al eliminar", async () => {
    const store = makeStore();
    await store.dispatch(deleteChecklist({ checklistId: "checklist-1", cardId: "card-1" }));

    const checklists = store.getState().boards.currentBoard?.lists[0].cards[0].checklists;
    expect(checklists?.[0].id).toBe("checklist-2");
    expect(checklists?.[0].title).toBe("Otro checklist");
  });
});

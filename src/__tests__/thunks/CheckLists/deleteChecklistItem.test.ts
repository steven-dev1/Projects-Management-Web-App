import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteChecklistItem } from "@/store/features/boards/ChecklistThunks";
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
                items: [
                  { id: "item-1", checklist_id: "checklist-1", title: "Item 1", is_completed: false, position: 0 },
                  { id: "item-2", checklist_id: "checklist-1", title: "Item 2", is_completed: false, position: 1 },
                ],
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

describe("deleteChecklistItem", () => {
  beforeEach(() => {
    mockEq.mockResolvedValue({ error: null });
  });

  it("debería eliminar el item del checklist", async () => {
    const store = makeStore();

    await store.dispatch(
      deleteChecklistItem({
        itemId: "item-1",
        checklistId: "checklist-1",
        cardId: "card-1",
      }),
    );

    const items = store.getState().boards.currentBoard?.lists[0].cards[0].checklists?.[0].items;

    expect(items).toHaveLength(1);
    expect(items?.[0].id).toBe("item-2");
  });

  it("debería retornar fulfilled con los ids correctos", async () => {
    const store = makeStore();

    const result = await store.dispatch(
      deleteChecklistItem({
        itemId: "item-1",
        checklistId: "checklist-1",
        cardId: "card-1",
      }),
    );

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect(result.payload).toEqual({
      itemId: "item-1",
      checklistId: "checklist-1",
      cardId: "card-1",
    });
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockEq.mockResolvedValueOnce({ error: { message: "Error al eliminar item" } });

    const store = makeStore();
    const result = await store.dispatch(
      deleteChecklistItem({
        itemId: "item-1",
        checklistId: "checklist-1",
        cardId: "card-1",
      }),
    );

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al eliminar item");
  });
  it("debería llamar a Supabase con el id correcto", async () => {
    const store = makeStore();
    await store.dispatch(
      deleteChecklistItem({
        itemId: "item-1",
        checklistId: "checklist-1",
        cardId: "card-1",
      }),
    );
    expect(mockEq).toHaveBeenCalledWith("id", "item-1");
  });

  it("no debería afectar otros items al eliminar", async () => {
    const store = makeStore();
    await store.dispatch(
      deleteChecklistItem({
        itemId: "item-1",
        checklistId: "checklist-1",
        cardId: "card-1",
      }),
    );

    const items = store.getState().boards.currentBoard?.lists[0].cards[0].checklists?.[0].items;

    expect(items?.[0].title).toBe("Item 2");
  });
});

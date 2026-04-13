import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateChecklistItem } from "@/store/features/boards/ChecklistThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardResponse, BoardsState } from "@/store/features/boards/BoardsTypes";

const { mockEq } = vi.hoisted(() => ({
  mockEq: vi.fn(),
}));

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
            labels: [],
            checklists: [
              {
                id: "checklist-1",
                card_id: "card-1",
                title: "Mi checklist",
                position: 0,
                items: [
                  {
                    id: "item-1",
                    checklist_id: "checklist-1",
                    title: "Título original",
                    is_completed: false,
                    position: 0,
                  },
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

describe("updateChecklistItem", () => {
  beforeEach(() => {
    mockEq.mockResolvedValue({ error: null });
  });

  it("debería actualizar el título del item", async () => {
    const store = makeStore();

    await store.dispatch(
      updateChecklistItem({
        itemId: "item-1",
        checklistId: "checklist-1",
        cardId: "card-1",
        title: "Título actualizado",
      }),
    );

    const item = store.getState().boards.currentBoard?.lists[0].cards[0].checklists?.[0].items[0];

    expect(item?.title).toBe("Título actualizado");
  });

  it("debería retornar fulfilled con los datos correctos", async () => {
    const store = makeStore();

    const result = await store.dispatch(
      updateChecklistItem({
        itemId: "item-1",
        checklistId: "checklist-1",
        cardId: "card-1",
        title: "Título actualizado",
      }),
    );

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect(result.payload).toEqual({
      itemId: "item-1",
      checklistId: "checklist-1",
      cardId: "card-1",
      title: "Título actualizado",
    });
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockEq.mockResolvedValueOnce({ error: { message: "Error al actualizar item" } });

    const store = makeStore();
    const result = await store.dispatch(
      updateChecklistItem({
        itemId: "item-1",
        checklistId: "checklist-1",
        cardId: "card-1",
        title: "Título actualizado",
      }),
    );

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al actualizar item");
  });
  it("debería llamar a Supabase con los parámetros correctos", async () => {
    const store = makeStore();
    await store.dispatch(
      updateChecklistItem({
        itemId: "item-1",
        checklistId: "checklist-1",
        cardId: "card-1",
        title: "Título actualizado",
      }),
    );
    expect(mockEq).toHaveBeenCalledWith("id", "item-1");
  });

  it("no debería modificar otros items al actualizar", async () => {
    const stateWithMultipleItems: BoardsState = {
      ...initialBoardsState,
      currentBoard: {
        ...initialBoardsState.currentBoard,
        lists: [
          {
            ...initialBoardsState.currentBoard!.lists[0],
            cards: [
              {
                ...initialBoardsState.currentBoard!.lists[0].cards[0],
                checklists: [
                  {
                    id: "checklist-1",
                    card_id: "card-1",
                    title: "Mi checklist",
                    position: 0,
                    items: [
                      {
                        id: "item-1",
                        checklist_id: "checklist-1",
                        title: "Título original",
                        is_completed: false,
                        position: 0,
                      },
                      {
                        id: "item-2",
                        checklist_id: "checklist-1",
                        title: "Otro item",
                        is_completed: false,
                        position: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      } as unknown as BoardResponse,
    };

    const store = configureStore({
      reducer: { boards: boardsReducer },
      preloadedState: { boards: stateWithMultipleItems },
    });

    await store.dispatch(
      updateChecklistItem({
        itemId: "item-1",
        checklistId: "checklist-1",
        cardId: "card-1",
        title: "Título actualizado",
      }),
    );

    const items = store.getState().boards.currentBoard?.lists[0].cards[0].checklists?.[0].items;

    expect(items?.[0].title).toBe("Título actualizado");
    expect(items?.[1].title).toBe("Otro item");
  });
});

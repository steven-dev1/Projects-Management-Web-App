import { describe, it, expect, vi, beforeEach } from "vitest";
import { addChecklistItem } from "@/store/features/boards/ChecklistThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardResponse, BoardsState } from "@/store/features/boards/BoardsTypes";

const { mockSingle } = vi.hoisted(() => ({
  mockSingle: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({
    from: () => ({
      insert: () => ({
        select: () => ({
          single: mockSingle,
        }),
      }),
    }),
  }),
}));

const mockItem = {
  id: "item-1",
  checklist_id: "checklist-1",
  title: "Nuevo item",
  is_completed: false,
  position: 0,
};

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

describe("addChecklistItem", () => {
  beforeEach(() => {
    mockSingle.mockResolvedValue({ data: mockItem, error: null });
  });

  it("debería agregar el item al checklist correcto", async () => {
    const store = makeStore();

    await store.dispatch(
      addChecklistItem({
        checklist_id: "checklist-1",
        title: "Nuevo item",
        cardId: "card-1",
      }),
    );

    const checklist = store.getState().boards.currentBoard?.lists[0].cards[0].checklists?.[0];

    expect(checklist?.items).toHaveLength(1);
    expect(checklist?.items[0].title).toBe("Nuevo item");
  });

  it("debería agregar el item con is_completed en false por defecto", async () => {
    const store = makeStore();

    await store.dispatch(
      addChecklistItem({
        checklist_id: "checklist-1",
        title: "Nuevo item",
        cardId: "card-1",
      }),
    );

    const item = store.getState().boards.currentBoard?.lists[0].cards[0].checklists?.[0].items[0];

    expect(item?.is_completed).toBe(false);
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: "Error al agregar item" } });

    const store = makeStore();
    const result = await store.dispatch(
      addChecklistItem({
        checklist_id: "checklist-1",
        title: "Nuevo item",
        cardId: "card-1",
      }),
    );

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al agregar item");
  });
  it("debería retornar el item creado con sus datos", async () => {
    const store = makeStore();
    const result = await store.dispatch(
      addChecklistItem({
        checklist_id: "checklist-1",
        title: "Nuevo item",
        cardId: "card-1",
      }),
    );

    const payload = result.payload as { item: typeof mockItem; cardId: string };
    expect(payload.item.id).toBe("item-1");
    expect(payload.item.title).toBe("Nuevo item");
    expect(payload.cardId).toBe("card-1");
  });
  it("debería llamar a Supabase con los parámetros correctos", async () => {
    const store = makeStore();
    await store.dispatch(
      addChecklistItem({
        checklist_id: "checklist-1",
        title: "Nuevo item",
        cardId: "card-1",
      }),
    );
    expect(mockSingle).toHaveBeenCalled();
  });

  it("debería agregar el item en posición 0", async () => {
    const store = makeStore();
    await store.dispatch(
      addChecklistItem({
        checklist_id: "checklist-1",
        title: "Nuevo item",
        cardId: "card-1",
      }),
    );

    const item = store.getState().boards.currentBoard?.lists[0].cards[0].checklists?.[0].items[0];

    expect(item?.position).toBe(0);
  });
});

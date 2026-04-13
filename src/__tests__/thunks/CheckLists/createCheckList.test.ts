import { describe, it, expect, vi, beforeEach } from "vitest";
import { createChecklist } from "@/store/features/boards/ChecklistThunks";
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

const mockChecklist = {
  id: "checklist-1",
  card_id: "card-1",
  title: "Mi checklist",
  position: 0,
  items: [],
};

describe("createChecklist", () => {
  beforeEach(() => {
    mockSingle.mockResolvedValue({ data: mockChecklist, error: null });
  });

  it("Debería agregar el checklist a la card correcta", async () => {
    const store = makeStore();

    await store.dispatch(createChecklist({ card_id: "card-1", title: "Mi checklist" }));

    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.checklists).toHaveLength(1);
    expect(card?.checklists?.[0].title).toBe("Mi checklist");
  });

  it("Debería inicializar items como array vacío si no vienen", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { ...mockChecklist, items: null },
      error: null,
    });

    const store = makeStore();
    await store.dispatch(createChecklist({ card_id: "card-1", title: "Mi checklist" }));

    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.checklists?.[0].items).toEqual([]);
  });

  it("Debería retornar rejected si Supabase falla", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: "Error al crear checklist" } });

    const store = makeStore();
    const result = await store.dispatch(createChecklist({ card_id: "card-1", title: "Mi checklist" }));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al crear checklist");
  });
  it("Debería retornar el checklist creado con sus datos", async () => {
    const store = makeStore();
    const result = await store.dispatch(createChecklist({ card_id: "card-1", title: "Mi checklist" }));

    expect((result.payload as typeof mockChecklist).id).toBe("checklist-1");
    expect((result.payload as typeof mockChecklist).title).toBe("Mi checklist");
  });
  it("Debería llamar a Supabase con los parámetros correctos", async () => {
    const store = makeStore();
    await store.dispatch(createChecklist({ card_id: "card-1", title: "Mi checklist" }));
    expect(mockSingle).toHaveBeenCalled();
  });

  it("Debería agregar el checklist con items vacíos si Supabase devuelve items null", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { ...mockChecklist, items: null },
      error: null,
    });

    const store = makeStore();
    await store.dispatch(createChecklist({ card_id: "card-1", title: "Mi checklist" }));

    const checklists = store.getState().boards.currentBoard?.lists[0].cards[0].checklists;
    expect(checklists?.[0].items).toEqual([]);
  });
});

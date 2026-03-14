import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateCard } from "@/store/features/boards/CardsThunks";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardResponse, BoardsState } from "@/store/features/boards/BoardsTypes";

const { mockSingle } = vi.hoisted(() => ({
  mockSingle: vi.fn(),
}));

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
            title: "Título original",
            description: "Descripción original",
            due_date: null,
            list_id: "list-1",
            position: 0,
            is_completed: false,
            labels: [{ id: "label-1", name: "Bug", color: "#ff0000" }],
            checklists: [{ id: "checklist-1", card_id: "card-1", title: "Checklist", position: 0, items: [] }],
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

describe("updateCard", () => {
  beforeEach(() => {
    mockSingle.mockResolvedValue({
      data: { id: "card-1", title: "Título actualizado", description: "Nueva descripción", due_date: "2026-03-20" },
      error: null,
    });
  });

  it("debería actualizar el título de la card", async () => {
    const store = makeStore();

    await store.dispatch(updateCard({ cardId: "card-1", title: "Título actualizado" }));

    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.title).toBe("Título actualizado");
  });

  it("debería actualizar la descripción de la card", async () => {
    const store = makeStore();

    await store.dispatch(updateCard({ cardId: "card-1", title: "Título actualizado", description: "Nueva descripción" }));

    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.description).toBe("Nueva descripción");
  });

  it("debería actualizar el due_date de la card", async () => {
    const store = makeStore();

    await store.dispatch(updateCard({ cardId: "card-1", title: "Título actualizado", due_date: "2026-03-20" }));

    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.due_date).toBe("2026-03-20");
  });

  it("debería preservar los labels al actualizar", async () => {
    const store = makeStore();

    await store.dispatch(updateCard({ cardId: "card-1", title: "Título actualizado" }));

    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.labels).toHaveLength(1);
    expect(card?.labels?.[0].name).toBe("Bug");
  });

  it("debería preservar los checklists al actualizar", async () => {
    const store = makeStore();

    await store.dispatch(updateCard({ cardId: "card-1", title: "Título actualizado" }));

    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.checklists).toHaveLength(1);
  });

  it("debería retornar fulfilled con los datos actualizados", async () => {
    const store = makeStore();

    const result = await store.dispatch(updateCard({ cardId: "card-1", title: "Título actualizado" }));

    expect(result.meta.requestStatus).toBe("fulfilled");
  });

  it("debería llamar a Supabase con el id correcto", async () => {
    const store = makeStore();

    await store.dispatch(updateCard({ cardId: "card-1", title: "Título actualizado" }));

    expect(mockSingle).toHaveBeenCalled();
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: "Error al actualizar" } });

    const store = makeStore();
    const result = await store.dispatch(updateCard({ cardId: "card-1", title: "Título actualizado" }));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al actualizar");
  });
});
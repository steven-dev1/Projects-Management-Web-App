import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateLabel } from "@/store/features/boards/LabelsThunks";
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
            title: "Test card",
            list_id: "list-1",
            position: 0,
            is_completed: false,
            labels: [{ id: "label-1", name: "Bug", color: "#ff0000" }],
            checklists: [],
          },
        ],
      },
    ],
    labels: [{ id: "label-1", name: "Bug", color: "#ff0000" }],
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

describe("updateLabel", () => {
  beforeEach(() => {
    mockSingle.mockResolvedValue({
      data: { id: "label-1", name: "Bug actualizado", color: "#ff0000" },
      error: null,
    });
  });

  it("debería actualizar el nombre del label en el board", async () => {
    const store = makeStore();

    await store.dispatch(updateLabel({ labelId: "label-1", name: "Bug actualizado" }));

    const label = store.getState().boards.currentBoard?.labels?.find((l) => l.id === "label-1");
    expect(label?.name).toBe("Bug actualizado");
  });

  it("debería actualizar el nombre del label en las cards", async () => {
    const store = makeStore();

    await store.dispatch(updateLabel({ labelId: "label-1", name: "Bug actualizado" }));

    const cardLabel = store.getState().boards.currentBoard?.lists[0].cards[0].labels?.find((l) => l.id === "label-1");

    expect(cardLabel?.name).toBe("Bug actualizado");
  });

  it("debería retornar fulfilled con el label actualizado", async () => {
    const store = makeStore();

    const result = await store.dispatch(updateLabel({ labelId: "label-1", name: "Bug actualizado" }));

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect((result.payload as { id: string; name: string }).name).toBe("Bug actualizado");
  });

  it("debería llamar a Supabase con el id correcto", async () => {
    const store = makeStore();

    await store.dispatch(updateLabel({ labelId: "label-1", name: "Bug actualizado" }));

    expect(mockSingle).toHaveBeenCalled();
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: "Error al actualizar etiqueta" } });

    const store = makeStore();
    const result = await store.dispatch(updateLabel({ labelId: "label-1", name: "Bug actualizado" }));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al actualizar etiqueta");
  });
});

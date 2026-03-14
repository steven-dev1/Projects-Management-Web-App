import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCard } from "@/store/features/boards/CardsThunks";
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

const mockCard = {
  id: "card-1",
  title: "Nueva tarjeta",
  list_id: "list-1",
  position: 0,
  description: null,
  due_date: null,
  is_completed: false,
  assigned_to: null,
  status: "active",
};

const initialBoardsState: BoardsState = {
  currentBoard: {
    id: "board-1",
    name: "Test Board",
    lists: [
      {
        id: "list-1",
        title: "Test List",
        cards: [],
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

describe("createCard", () => {
  beforeEach(() => {
    mockSingle.mockResolvedValue({ data: mockCard, error: null });
  });

  it("debería agregar la card a la lista correcta", async () => {
    const store = makeStore();

    await store.dispatch(
      createCard({
        title: "Nueva tarjeta",
        list_id: "list-1",
        position: 0,
      }),
    );

    const cards = store.getState().boards.currentBoard?.lists[0].cards;
    expect(cards).toHaveLength(1);
    expect(cards?.[0].title).toBe("Nueva tarjeta");
  });

  it("debería retornar la card creada con sus datos", async () => {
    const store = makeStore();

    const result = await store.dispatch(
      createCard({
        title: "Nueva tarjeta",
        list_id: "list-1",
        position: 0,
      }),
    );

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect((result.payload as unknown as typeof mockCard).id).toBe("card-1");
    expect((result.payload as unknown as typeof mockCard).title).toBe("Nueva tarjeta");
  });

  it("debería retornar rejected si Supabase falla", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: "Error al crear la tarjeta" } });

    const store = makeStore();
    const result = await store.dispatch(
      createCard({
        title: "Nueva tarjeta",
        list_id: "list-1",
        position: 0,
      }),
    );

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Error al crear la tarjeta");
  });
  it("debería crear la card en la posición correcta", async () => {
    mockSingle.mockResolvedValueOnce({ data: { ...mockCard, position: 3 }, error: null });

    const store = makeStore();
    await store.dispatch(
      createCard({
        title: "Nueva tarjeta",
        list_id: "list-1",
        position: 3,
      }),
    );

    const card = store.getState().boards.currentBoard?.lists[0].cards[0];
    expect(card?.position).toBe(3);
  });

  it("debería crear la card con due_date null si no se pasa", async () => {
    const store = makeStore();
    const result = await store.dispatch(
      createCard({
        title: "Nueva tarjeta",
        list_id: "list-1",
        position: 0,
      }),
    );

    expect((result.payload as unknown as typeof mockCard).due_date).toBeNull();
  });

  it("debería crear la card con description null si no se pasa", async () => {
    const store = makeStore();
    const result = await store.dispatch(
      createCard({
        title: "Nueva tarjeta",
        list_id: "list-1",
        position: 0,
      }),
    );

    expect((result.payload as unknown as typeof mockCard).description).toBeNull();
  });

  it("debería crear la card con due_date si se pasa", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { ...mockCard, due_date: "2026-03-20T00:00:00.000Z" },
      error: null,
    });

    const store = makeStore();
    const result = await store.dispatch(
      createCard({
        title: "Nueva tarjeta",
        list_id: "list-1",
        position: 0,
        due_date: "2026-03-20T00:00:00.000Z",
      }),
    );

    expect((result.payload as unknown as typeof mockCard).due_date).toBe("2026-03-20T00:00:00.000Z");
  });
});

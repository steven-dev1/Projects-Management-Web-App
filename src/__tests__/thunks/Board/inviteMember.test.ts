import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "@/store/features/boards/BoardsSlice";
import { BoardsState } from "@/store/features/boards/BoardsTypes";
import { inviteMember } from "@/store/features/boards/inviteThunks";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

vi.mock("@/lib/supabaseClient", () => ({
  createClient: () => ({
    from: () => ({}),
  }),
}));

const initialBoardsState: BoardsState = {
  currentBoardId: null,
  currentBoard: null,
  boards: [],
  status: "idle",
  error: null,
  searchQuery: "",
};

const makeStore = () =>
  configureStore({
    reducer: { boards: boardsReducer },
    preloadedState: { boards: initialBoardsState },
  });

describe("inviteMember", () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  it("debería retornar fulfilled cuando la invitación se envía correctamente", async () => {
    const store = makeStore();

    const result = await store.dispatch(inviteMember({
      boardId: "board-1",
      email: "test@email.com",
      role: "member",
    }));

    expect(result.meta.requestStatus).toBe("fulfilled");
  });

  it("debería llamar al endpoint correcto", async () => {
    const store = makeStore();

    await store.dispatch(inviteMember({
      boardId: "board-1",
      email: "test@email.com",
      role: "member",
    }));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/boards/board-1/invite",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@email.com", role: "member" }),
      }),
    );
  });

  it("debería usar role member por defecto si no se pasa", async () => {
    const store = makeStore();

    await store.dispatch(inviteMember({
      boardId: "board-1",
      email: "test@email.com",
      role: "member",
    }));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/boards/board-1/invite",
      expect.objectContaining({
        body: JSON.stringify({ email: "test@email.com", role: "member" }),
      }),
    );
  });

  it("debería retornar rejected si la API devuelve error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Ya existe una invitación pendiente" }),
    });

    const store = makeStore();
    const result = await store.dispatch(inviteMember({
      boardId: "board-1",
      email: "test@email.com",
      role: "member",
    }));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Ya existe una invitación pendiente");
  });

  it("debería retornar rejected si fetch lanza un error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const store = makeStore();
    const result = await store.dispatch(inviteMember({
      boardId: "board-1",
      email: "test@email.com",
      role: "member",
    }));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(result.payload).toBe("Network error");
  });
});
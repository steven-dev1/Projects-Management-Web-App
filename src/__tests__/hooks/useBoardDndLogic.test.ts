import { describe, it, expect } from "vitest";
import { calculateCardMove, calculateListMove } from "@/hooks/useBoardDndLogic";
import { BoardList } from "@/store/features/boards/BoardsTypes";

const makeLists = (): BoardList[] => [
  {
    id: "list-1",
    title: "Lista 1",
    position: 0,
    board_id: "board-1",
    status: "active",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
    cards: [
      { id: "card-1", title: "Card 1", list_id: "list-1", position: 0, is_completed: false, labels: [], checklists: [] },
      { id: "card-2", title: "Card 2", list_id: "list-1", position: 1, is_completed: false, labels: [], checklists: [] },
      { id: "card-3", title: "Card 3", list_id: "list-1", position: 2, is_completed: false, labels: [], checklists: [] },
    ],
  },
  {
    id: "list-2",
    title: "Lista 2",
    position: 1,
    board_id: "board-1",
    status: "active",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
    cards: [
      { id: "card-4", title: "Card 4", list_id: "list-2", position: 0, is_completed: false, labels: [], checklists: [] },
    ],
  },
  {
    id: "list-3",
    title: "Lista 3",
    position: 2,
    board_id: "board-1",
    status: "active",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
    cards: [],
  },
];

// calculateCardmOve

describe("calculateCardMove", () => {
  it("debería retornar null si la card no existe", () => {
    const result = calculateCardMove(makeLists(), "card-inexistente", "list-2");
    expect(result).toBeNull();
  });

  it("debería retornar null si el destino no existe", () => {
    const result = calculateCardMove(makeLists(), "card-1", "lista-inexistente");
    expect(result).toBeNull();
  });

  it("debería retornar null si se suelta en la misma posición", () => {

    const result = calculateCardMove(makeLists(), "card-1", "card-1");
    expect(result).toBeNull();
  });

  it("debería calcular mover una card a otra lista", () => {

    const result = calculateCardMove(makeLists(), "card-1", "list-2");
    expect(result).not.toBeNull();
    expect(result?.fromListId).toBe("list-1");
    expect(result?.toListId).toBe("list-2");
  });

  it("debería calcular mover una card a una lista vacía", () => {
    const result = calculateCardMove(makeLists(), "card-1", "list-3");
    expect(result).not.toBeNull();
    expect(result?.toListId).toBe("list-3");
    expect(result?.newIndex).toBeGreaterThanOrEqual(0);
  });

  it("debería calcular reordenar dentro de la misma lista — card hacia abajo", () => {

    const result = calculateCardMove(makeLists(), "card-1", "card-3");
    expect(result).not.toBeNull();
    expect(result?.fromListId).toBe("list-1");
    expect(result?.toListId).toBe("list-1");
    expect(result?.newIndex).toBe(2);
  });

  it("debería calcular reordenar dentro de la misma lista — card hacia arriba", () => {

    const result = calculateCardMove(makeLists(), "card-3", "card-1");
    expect(result).not.toBeNull();
    expect(result?.fromListId).toBe("list-1");
    expect(result?.toListId).toBe("list-1");
    expect(result?.newIndex).toBe(0);
  });

  it("el rpcIndex debe ser diferente al newIndex cuando la card baja en la misma lista", () => {

    const result = calculateCardMove(makeLists(), "card-1", "card-3");
    expect(result?.rpcIndex).toBe(result!.newIndex - 1);
  });

  it("el rpcIndex debe ser igual al newIndex cuando la card sube en la misma lista", () => {
    const result = calculateCardMove(makeLists(), "card-3", "card-1");
    expect(result?.rpcIndex).toBe(result?.newIndex);
  });
});

// calculateListMove

describe("calculateListMove", () => {
  it("debería retornar null si la lista activa no existe", () => {
    const result = calculateListMove(makeLists(), "lista-inexistente", "list-2");
    expect(result).toBeNull();
  });

  it("debería retornar null si la lista destino no existe", () => {
    const result = calculateListMove(makeLists(), "list-1", "lista-inexistente");
    expect(result).toBeNull();
  });

  it("debería calcular mover list-1 a la posición de list-3", () => {
    const result = calculateListMove(makeLists(), "list-1", "list-3");
    expect(result).not.toBeNull();
    expect(result?.oldIndex).toBe(0);
    expect(result?.newIndex).toBe(2);
  });

  it("debería calcular mover list-3 a la posición de list-1", () => {
    const result = calculateListMove(makeLists(), "list-3", "list-1");
    expect(result?.oldIndex).toBe(2);
    expect(result?.newIndex).toBe(0);
  });

  it("debería calcular mover una lista a la posición adyacente", () => {
    const result = calculateListMove(makeLists(), "list-1", "list-2");
    expect(result?.oldIndex).toBe(0);
    expect(result?.newIndex).toBe(1);
  });
});
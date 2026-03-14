'use client'
import { BoardList } from "@/store/features/boards/BoardsTypes"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import { useState } from "react"

export default function DragDropProvider({ children }: { children: React.ReactNode }) {
    const [lists, setLists] = useState<BoardList[]>([
    // tus listas iniciales
  ])

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result

    // Caso 1: No se soltó en ningún lugar válido
    if (!destination) return

    // Caso 2: Se soltó en la misma posición → no hacer nada
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // ------------------------------
    // CASO A: Reordenar / Mover LISTAS (columnas)
    // ------------------------------
    if (type === 'LIST') {
      const newLists = [...lists]
      const [movedList] = newLists.splice(source.index, 1)
      newLists.splice(destination.index, 0, movedList)

      setLists(newLists)

      // Aquí iría la llamada al backend (debounced)
      // updateListPositions(newLists.map((l, idx) => ({ id: l.id, position: idx })))
      return
    }

    // ------------------------------
    // CASO B: Reordenar / Mover CARDS (tarjetas)
    // ------------------------------
    const sourceListIndex = lists.findIndex(l => l.id === source.droppableId)
    const destListIndex   = lists.findIndex(l => l.id === destination.droppableId)

    if (sourceListIndex === -1 || destListIndex === -1) return

    const sourceList = lists[sourceListIndex]
    const destList   = lists[destListIndex]

    // Mismo droppableId → reordenar dentro de la misma lista
    if (source.droppableId === destination.droppableId) {
      const newCards = [...sourceList.cards]
      const [movedCard] = newCards.splice(source.index, 1)
      newCards.splice(destination.index, 0, movedCard)

      const newLists = [...lists]
      newLists[sourceListIndex] = { ...sourceList, cards: newCards }

      setLists(newLists)

      // Backend: actualizar posiciones de cards en esta lista
      // updateCardPositions(sourceList.id, newCards.map((c, idx) => ({ id: c.id, position: idx })))
      return
    }

    // Diferente lista → mover card de una lista a otra
    const newSourceCards = [...sourceList.cards]
    const [movedCard] = newSourceCards.splice(source.index, 1)

    const newDestCards = [...destList.cards]
    newDestCards.splice(destination.index, 0, movedCard)

    const newLists = [...lists]
    newLists[sourceListIndex] = { ...sourceList, cards: newSourceCards }
    newLists[destListIndex]   = { ...destList,   cards: newDestCards }

    setLists(newLists)

    // Backend: actualizar lista destino y posiciones en ambas listas
    // Ejemplo:
    // moveCardToList(movedCard.id, destList.id, destination.index)
    // + actualizar posiciones de source y dest si es necesario
  }
  return <DragDropContext onDragEnd={handleDragEnd}>{children}</DragDropContext>;
}
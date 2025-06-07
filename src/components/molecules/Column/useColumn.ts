import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { useTodoContext } from "@/contexts/TodoContext/useTodoContext";

export const useColumn = (id: string) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const { addTodo, updateColumnTitle } = useTodoContext();

  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: id,
  });

  const setNodeRef = (element: HTMLElement | null) => {
    setSortableNodeRef(element);
    setDroppableNodeRef(element);
  };

  const handleColumnNameChange = (newTitle: string) => {
    if (newTitle.trim() !== "") {
      updateColumnTitle(id, newTitle);
    }
  };

  const handleAddTodo = () => {
    addTodo(id);
  };

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition: transition,
      opacity: isDragging ? 0 : 1,
      zIndex: isDragging ? 1000 : "auto",
    }),
    [transform, transition, isDragging]
  );

  return {
    attributes,
    listeners,
    setNodeRef,
    style,
    isDragging,
    handleColumnNameChange,
    handleAddTodo,
  };
};

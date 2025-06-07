import {
  type DragEndEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";

import { useTodoContext } from "@contexts/TodoContext/useTodoContext";

export const useMain = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [animateDrop, setAnimateDrop] = useState(true);
  const {
    columns,
    reorderTodosInColumn,
    moveTodoBetweenColumns,
    moveTodoToColumn,
    reorderColumns,
  } = useTodoContext();

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const mobileSensors = useSensors(useSensor(TouchSensor));
  const desktopSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id.toString());
    setAnimateDrop(true); // Default to animating drops at the start of a drag
  };

  const getType = (id: string) => {
    if (id?.startsWith("todo-")) return "todo";
    if (id?.startsWith("col-")) {
      return id.endsWith("-empty") ? "col" : "col";
    }
    if (id === "page") return "page";
    return "unknown";
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!active.id || !over?.id) {
      setActiveId(null);
      return;
    }

    const activeIdStr = active.id.toString();
    const overIdStr = over.id.toString();
    const activeType = getType(activeIdStr);
    const overType = getType(overIdStr);

    let isCrossColumnTodoMove = false;

    if (
      activeType === "col" &&
      overType === "col" &&
      activeIdStr !== overIdStr
    ) {
      reorderColumns(activeIdStr, overIdStr);
    } else if (activeType === "col" && overType === "page") {
      if (
        columns.length > 0 &&
        columns[columns.length - 1].id !== activeIdStr
      ) {
        reorderColumns(activeIdStr, columns[columns.length - 1].id);
      }
    } else if (activeType === "todo") {
      const activeColumn = columns.find((column) =>
        column.todos.some((todo) => todo.id === activeIdStr)
      );

      if (!activeColumn) {
        setActiveId(null);
        return;
      }

      if (overType === "todo") {
        const overColumn = columns.find((column) =>
          column.todos.some((todo) => todo.id === overIdStr)
        );

        if (!overColumn) {
          setActiveId(null);
          return;
        }

        if (activeColumn.id === overColumn.id) {
          // Same column reorder
          setAnimateDrop(true);
          reorderTodosInColumn(activeColumn.id, activeIdStr, overIdStr);
        } else {
          // Cross-column move (todo to todo)
          isCrossColumnTodoMove = true;
          setAnimateDrop(false);
          setActiveId(null); // Clear overlay before moving data
          moveTodoBetweenColumns(
            activeIdStr,
            activeColumn.id,
            overColumn.id,
            overColumn.todos.findIndex((todo) => todo.id === overIdStr)
          );
        }
      } else if (overType === "col") {
        const targetColumnId = overIdStr.replace("-empty", "");

        if (activeColumn.id === targetColumnId) {
          // Move to end of same column
          setAnimateDrop(true);
          moveTodoBetweenColumns(
            activeIdStr,
            activeColumn.id,
            activeColumn.id,
            activeColumn.todos.length
          );
        } else {
          // Cross-column move (todo to column)
          isCrossColumnTodoMove = true;
          setAnimateDrop(false);
          setActiveId(null); // Clear overlay before moving data
          moveTodoToColumn(activeIdStr, targetColumnId);
        }
      }
    }

    if (!isCrossColumnTodoMove) {
      // For same-column moves, column reorders, or no-op drags
      setAnimateDrop(true); // Ensure drop animation is enabled
      setTimeout(() => setActiveId(null), 0); // Defer clearing activeId to allow animation
    }
    // If isCrossColumnTodoMove is true, setActiveId(null) and setAnimateDrop(false) were already handled.
  };

  return {
    activeId,
    sensors: isMobile ? mobileSensors : desktopSensors,
    onDragStart,
    onDragEnd,
    animateDrop,
  };
};

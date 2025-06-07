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
    console.log("XD");
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
          reorderTodosInColumn(activeColumn.id, activeIdStr, overIdStr);
        } else {
          isCrossColumnTodoMove = true;
          setActiveId(null);
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
          moveTodoBetweenColumns(
            activeIdStr,
            activeColumn.id,
            activeColumn.id,
            activeColumn.todos.length
          );
        } else {
          isCrossColumnTodoMove = true;
          setActiveId(null);
          moveTodoToColumn(activeIdStr, targetColumnId);
        }
      }
    }

    if (!isCrossColumnTodoMove) {
      setTimeout(() => setActiveId(null), 0);
    }
  };

  return {
    activeId,
    sensors: isMobile ? mobileSensors : desktopSensors,
    onDragStart,
    onDragEnd,
  };
};

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
    moveColumn,
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
  };

  const getType = (id: string) => {
    if (id.indexOf("todo") > -1) return "todo";
    if (id.indexOf("col") > -1) return "col";
    return "page";
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!active.id || !over?.id) {
      setActiveId(null);
      return;
    }

    const activeType = getType(active.id.toString());
    const overType = getType(over?.id.toString());

    // Handle column reordering
    if (activeType === "col" && overType === "col" && active.id !== over.id) {
      reorderColumns(active.id as string, over.id as string);
      setActiveId(null);
      return;
    }

    if (activeType === "col" && overType === "page") {
      if (columns.length > 0) {
        moveColumn(active.id as string, columns[columns.length - 1].id);
      }
      setActiveId(null);
      return;
    }

    // Handle todo reordering and moving
    if (activeType === "todo" && overType === "todo") {
      const activeColumn = columns.find((column) =>
        column.todos.some((todo) => todo.id === active.id)
      );
      const overColumn = columns.find((column) =>
        column.todos.some((todo) => todo.id === over.id)
      );

      if (!activeColumn || !overColumn) {
        setActiveId(null);
        return;
      }

      if (activeColumn.id === overColumn.id) {
        reorderTodosInColumn(
          activeColumn.id,
          active.id as string,
          over.id as string
        );
      } else {
        const overTodoIndex = overColumn.todos.findIndex(
          (todo) => todo.id === over.id
        );
        moveTodoBetweenColumns(
          active.id as string,
          activeColumn.id,
          overColumn.id,
          overTodoIndex
        );
      }

      setActiveId(null);
      return;
    }

    if (activeType === "todo" && overType === "col") {
      const activeColumn = columns.find((column) =>
        column.todos.some((todo) => todo.id === active.id)
      );

      if (!activeColumn) {
        setActiveId(null);
        return;
      }

      if (activeColumn.id !== over.id) {
        moveTodoToColumn(active.id as string, over.id as string);
      }
    }

    setActiveId(null);
  };

  return {
    activeId,
    sensors: isMobile ? mobileSensors : desktopSensors,
    onDragStart,
    onDragEnd,
  };
};

import { arrayMove } from "@dnd-kit/sortable";
import update from "immutability-helper";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useLocalStorage } from "hooks/useLocalStorage";

import type { Column } from "../TodoContext.types";

export const useColumns = (initialColumns?: Column[]) => {
  const { set, get } = useLocalStorage();
  const [columns, setColumns] = useState<Column[]>(
    initialColumns ?? get<Column[]>("columns") ?? []
  );

  useEffect(() => {
    set("columns", columns);
  }, [columns, set]);

  const addColumn = () => {
    setColumns((prevColumns) => [
      ...prevColumns,
      { id: `col-${uuidv4()}`, title: "New Column", todos: [] },
    ]);
  };

  const deleteColumn = (id: string) => {
    setColumns((prevColumns) => prevColumns.filter((i) => i.id !== id));
  };

  const moveColumn = (columnId: string, behindId: string) => {
    const columnIndex = columns.findIndex((i) => i.id === columnId);
    const behindIndex = columns.findIndex((i) => i.id === behindId);
    if (columnIndex !== -1 && behindIndex !== -1) {
      const columnToMove = columns[columnIndex];
      const updatedColumns = update(columns, {
        $splice: [
          [columnIndex, 1],
          [behindIndex, 0, columnToMove],
        ],
      });
      setColumns(updatedColumns);
    }
  };

  const reorderColumns = (activeId: string, overId: string) => {
    const oldIndex = columns.findIndex((column) => column.id === activeId);
    const newIndex = columns.findIndex((column) => column.id === overId);

    if (oldIndex !== -1 && newIndex !== -1) {
      setColumns(arrayMove(columns, oldIndex, newIndex));
    }
  };

  const updateColumnTitle = (columnId: string, newTitle: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId ? { ...column, title: newTitle } : column
      )
    );
  };

  return {
    columns,
    setColumns,
    addColumn,
    deleteColumn,
    moveColumn,
    reorderColumns,
    updateColumnTitle,
  };
};

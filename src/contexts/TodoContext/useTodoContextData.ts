import type { Column } from "./TodoContext.types";
import { useColumns, useFilter, useTodos } from "./hooks";
import { useSelected } from "./hooks/useSelected";

export const useTodoContextData = (initialColumns?: Column[]) => {
  const {
    columns,
    addColumn,
    deleteColumn,
    moveColumn,
    reorderColumns,
    updateColumnTitle,
    setColumns,
  } = useColumns(initialColumns);
  const {
    addTodo,
    removeTodo,
    updateTodo,
    moveTodoInColumn,
    reorderTodosInColumn,
    moveTodoBetweenColumns,
    moveTodoToColumn,
  } = useTodos(setColumns);
  const {
    columns: columnsWithFilteredTodos,
    searchTodos,
    searchText,
    filterStatus,
    setFilterStatus,
  } = useFilter(columns);
  const {
    selectAllInColumn,
    deleteSelected,
    setFinishedStatusOfSelected,
    moveSelected,
    select,
  } = useSelected(setColumns);

  return {
    columns: columnsWithFilteredTodos,
    addTodo,
    removeTodo,
    updateTodo,
    addColumn,
    deleteColumn,
    moveTodoInColumn,
    reorderTodosInColumn,
    moveTodoBetweenColumns,
    moveTodoToColumn,
    moveColumn,
    reorderColumns,
    searchTodos,
    searchText,
    updateColumnTitle,
    filterStatus,
    setFilterStatus,
    selectAllInColumn,
    deleteSelected,
    setFinishedStatusOfSelected,
    moveSelected,
    select,
  };
};

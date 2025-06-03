import { useState } from "react";

import { useDebounce } from "hooks/useDebounce";

import { type Column, type Todo, FilterStatus } from "../TodoContext.types";

export const useFilter = (columns: Column[]) => {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL
  );

  const searchTodos = useDebounce((text: string) => setSearchText(text), 150);

  const applySearch = (todos: Todo[]) => {
    return todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const applyFilterStatus = (todos: Todo[]) => {
    return todos.filter((todo) => {
      const isStatusMatchAll = filterStatus === FilterStatus.ALL;
      const isStatusMatchFinished =
        filterStatus === FilterStatus.FINISHED && todo.isFinished;
      const isStatusMatchUnfinished =
        filterStatus === FilterStatus.UNFINISHED && !todo.isFinished;

      return (
        isStatusMatchAll || isStatusMatchFinished || isStatusMatchUnfinished
      );
    });
  };

  const columnsWithSearchedAndFilteredTodos = columns.map((column) => {
    const searchedTodos = applySearch(column.todos);
    const searchedAndFilteredTodos = applyFilterStatus(searchedTodos);

    return {
      ...column,
      todos: searchedAndFilteredTodos,
    };
  });

  return {
    columns: columnsWithSearchedAndFilteredTodos,
    setSearchText,
    setFilterStatus,
    searchText,
    filterStatus,
    searchTodos,
  };
};

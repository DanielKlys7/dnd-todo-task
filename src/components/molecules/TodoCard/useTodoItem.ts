import type { Todo } from "contexts/TodoContext/TodoContext.types";
import { useTodoContext } from "contexts/TodoContext/useTodoContext";

export const useSortableTodoItem = (todoId: string) => {
  const { updateTodo, removeTodo, searchText, select } = useTodoContext();

  const handleFinishedClick = (parentId: string, todo: Todo) => {
    updateTodo(parentId, todo.id, { ...todo, isFinished: !todo.isFinished });
  };

  const handleRemoveClick = (parentId: string) => {
    removeTodo(parentId, todoId);
  };

  const handleUpdateTodoName = (
    columnId: string,
    todo: Todo,
    newTitle: string
  ) => {
    updateTodo(columnId, todoId, { ...todo, title: newTitle });
  };

  return {
    handleFinishedClick,
    handleRemoveClick,
    searchText,
    handleUpdateTodoName,
    select,
  };
};

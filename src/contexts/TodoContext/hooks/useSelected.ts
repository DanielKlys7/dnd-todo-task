import type { Column, Todo } from "../TodoContext.types";

export const useSelected = (
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>
) => {
  const select = (columnId: string, todoId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              todos: column.todos.map((todo) =>
                todo.id === todoId
                  ? { ...todo, selected: !todo.selected }
                  : todo
              ),
            }
          : column
      )
    );
  };

  const selectAllInColumn = (columnId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              todos: column.todos.map((todo) => ({ ...todo, selected: true })),
            }
          : column
      )
    );
  };

  const deleteSelected = () => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        todos: column.todos.filter((todo) => !todo.selected),
      }))
    );
  };

  const setFinishedStatusOfSelected = (isFinished: boolean) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        todos: column.todos.map((todo) =>
          todo.selected
            ? { ...todo, isFinished: isFinished, selected: false }
            : todo
        ),
      }))
    );
  };

  const moveSelected = (targetColumnId: string) => {
    setColumns((prevColumns) => {
      const selectedTodos: { columnId: string; todo: Todo }[] = [];

      const updatedColumns = prevColumns.map((column) => {
        const updatedTodos = column.todos.filter((todo) => {
          if (todo.selected) {
            selectedTodos.push({ columnId: column.id, todo });
            return false;
          }
          return true;
        });

        return { ...column, todos: updatedTodos };
      });

      const targetColumnIndex = updatedColumns.findIndex(
        (column) => column.id === targetColumnId
      );
      if (targetColumnIndex !== -1) {
        const targetColumn = updatedColumns[targetColumnIndex];
        const updatedTargetColumn = {
          ...targetColumn,
          todos: [
            ...targetColumn.todos,
            ...selectedTodos.map((selectedTodo) => selectedTodo.todo),
          ],
        };
        updatedColumns[targetColumnIndex] = updatedTargetColumn;
      }

      return updatedColumns;
    });
  };

  return {
    selectAllInColumn,
    deleteSelected,
    setFinishedStatusOfSelected,
    moveSelected,
    select,
  };
};

import { arrayMove } from "@dnd-kit/sortable";
import update from "immutability-helper";
import { v4 as uuidv4 } from "uuid";

import type { Column, Todo } from "../TodoContext.types";

export const useTodos = (
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>
) => {
  const updateTodo = (columnId: string, todoId: string, todo: Todo) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        if (column.id === columnId) {
          const todoIndex = column.todos.findIndex((j) => j.id === todoId);

          if (todoIndex !== -1) {
            return {
              ...column,
              todos: update(column.todos, { [todoIndex]: { $set: todo } }),
            };
          }
        }

        return column;
      })
    );
  };

  const moveTodoInColumn = (todoId: string, behindId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        const todoIndex = column.todos.findIndex((j) => j.id === todoId);
        const behindIndex = column.todos.findIndex((j) => j.id === behindId);
        if (todoIndex !== -1 && behindIndex !== -1) {
          const updatedTodos = update(column.todos, {
            $splice: [
              [todoIndex, 1],
              [behindIndex, 0, column.todos[todoIndex]],
            ],
          });
          return { ...column, todos: updatedTodos };
        }
        return column;
      })
    );
  };

  const removeTodo = (columnId: string, todoId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        if (column.id === columnId) {
          const todoIndex = column.todos.findIndex((j) => j.id === todoId);
          if (todoIndex !== -1) {
            return {
              ...column,
              todos: update(column.todos, { $splice: [[todoIndex, 1]] }),
            };
          }
        }
        return column;
      })
    );
  };

  const addTodo = (columnId: string, todo?: Todo) => {
    const newTodo: Todo = {
      id: todo?.id ?? `todo-${uuidv4()}`,
      title: todo?.title ?? "New Todo",
      isFinished: todo?.isFinished ?? false,
      selected: todo?.selected ?? false,
    };

    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        if (column.id === columnId) {
          return { ...column, todos: [...column.todos, newTodo] };
        }
        return column;
      })
    );
  };

  const reorderTodosInColumn = (
    columnId: string,
    activeId: string,
    overId: string
  ) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        if (column.id === columnId) {
          const oldIndex = column.todos.findIndex(
            (todo) => todo.id === activeId
          );
          const newIndex = column.todos.findIndex((todo) => todo.id === overId);

          if (oldIndex !== -1 && newIndex !== -1) {
            return {
              ...column,
              todos: arrayMove(column.todos, oldIndex, newIndex),
            };
          }
        }
        return column;
      })
    );
  };

  const moveTodoBetweenColumns = (
    activeId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetIndex?: number
  ) => {
    setColumns((prevColumns) => {
      const activeTodo = prevColumns
        .find((column) => column.id === sourceColumnId)
        ?.todos.find((todo) => todo.id === activeId);

      if (!activeTodo) return prevColumns;

      return prevColumns.map((column) => {
        if (column.id === sourceColumnId) {
          // Remove todo from source column
          return {
            ...column,
            todos: column.todos.filter((todo) => todo.id !== activeId),
          };
        } else if (column.id === targetColumnId) {
          // Add todo to target column
          const newTodos = [...column.todos];
          const insertIndex =
            targetIndex !== undefined ? targetIndex : newTodos.length;
          newTodos.splice(insertIndex, 0, { ...activeTodo, selected: false });
          return { ...column, todos: newTodos };
        }
        return column;
      });
    });
  };

  const moveTodoToColumn = (activeId: string, targetColumnId: string) => {
    setColumns((prevColumns) => {
      let activeTodo: Todo | undefined;
      let sourceColumnId: string | undefined;

      // Find the active todo and its source column
      for (const column of prevColumns) {
        const todo = column.todos.find((t) => t.id === activeId);
        if (todo) {
          activeTodo = todo;
          sourceColumnId = column.id;
          break;
        }
      }

      if (!activeTodo || !sourceColumnId || sourceColumnId === targetColumnId) {
        return prevColumns;
      }

      // Create the todo to move with proper typing
      const todoToMove: Todo = {
        id: activeTodo.id,
        title: activeTodo.title,
        isFinished: activeTodo.isFinished,
        selected: false,
      };

      return prevColumns.map((column) => {
        if (column.id === sourceColumnId) {
          // Remove todo from source column
          return {
            ...column,
            todos: column.todos.filter((todo) => todo.id !== activeId),
          };
        } else if (column.id === targetColumnId) {
          // Add todo to target column at the end
          return {
            ...column,
            todos: [...column.todos, todoToMove],
          };
        }
        return column;
      });
    });
  };

  return {
    addTodo,
    removeTodo,
    updateTodo,
    moveTodoInColumn,
    reorderTodosInColumn,
    moveTodoBetweenColumns,
    moveTodoToColumn,
  };
};

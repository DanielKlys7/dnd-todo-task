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
            const updatedTodo = { ...todo };
            if (updatedTodo.isNew) {
              updatedTodo.isNew = false;
            }
            return update(column, {
              todos: { [todoIndex]: { $set: updatedTodo } },
            });
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
          const todoToMove = column.todos[todoIndex];
          return update(column, {
            todos: {
              $splice: [
                [todoIndex, 1],
                [behindIndex, 0, todoToMove],
              ],
            },
          });
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
            return update(column, { todos: { $splice: [[todoIndex, 1]] } });
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
      isNew: todo?.isNew ?? true,
    };

    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        if (column.id === columnId) {
          return update(column, { todos: { $push: [newTodo] } });
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
            return update(column, {
              todos: { $set: arrayMove(column.todos, oldIndex, newIndex) },
            });
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
      const sourceColumnIndex = prevColumns.findIndex(
        (col) => col.id === sourceColumnId
      );
      const targetColumnIndex = prevColumns.findIndex(
        (col) => col.id === targetColumnId
      );

      if (sourceColumnIndex === -1) return prevColumns;

      const sourceColumn = prevColumns[sourceColumnIndex];
      const activeTodo = sourceColumn.todos.find(
        (todo) => todo.id === activeId
      );

      if (!activeTodo) return prevColumns;

      if (sourceColumnId === targetColumnId) {
        const oldIndex = sourceColumn.todos.findIndex((t) => t.id === activeId);
        if (oldIndex === -1) return prevColumns;

        const newIndex = targetIndex;

        if (newIndex === undefined || newIndex >= sourceColumn.todos.length) {
          if (
            oldIndex === sourceColumn.todos.length - 1 &&
            (newIndex === undefined || newIndex >= sourceColumn.todos.length)
          ) {
            return prevColumns; // Already at the end, no change needed
          }
          // Move to the end
          const itemToMove = sourceColumn.todos[oldIndex];
          return update(prevColumns, {
            [sourceColumnIndex]: {
              todos: {
                $splice: [[oldIndex, 1]],
                $push: [itemToMove],
              },
            },
          });
        }

        if (newIndex !== undefined && oldIndex !== newIndex) {
          return update(prevColumns, {
            [sourceColumnIndex]: {
              todos: {
                $set: arrayMove(sourceColumn.todos, oldIndex, newIndex),
              },
            },
          });
        }
        return prevColumns;
      } else {
        if (targetColumnIndex === -1) return prevColumns;

        const updatedSourceTodos = update(sourceColumn.todos, {
          $splice: [
            [sourceColumn.todos.findIndex((todo) => todo.id === activeId), 1],
          ],
        });

        const targetColumn = prevColumns[targetColumnIndex];
        const insertIndex =
          targetIndex !== undefined ? targetIndex : targetColumn.todos.length;

        const updatedTargetTodos = update(targetColumn.todos, {
          $splice: [[insertIndex, 0, activeTodo]],
        });

        return update(prevColumns, {
          [sourceColumnIndex]: { todos: { $set: updatedSourceTodos } },
          [targetColumnIndex]: { todos: { $set: updatedTargetTodos } },
        });
      }
    });
  };

  const moveTodoToColumn = (activeId: string, targetColumnId: string) => {
    setColumns((prevColumns) => {
      let activeTodo: Todo | undefined;
      let sourceColumnId: string | undefined;
      let sourceColumnIndex = -1;
      let targetColumnIndex = -1;

      for (let i = 0; i < prevColumns.length; i++) {
        const column = prevColumns[i];
        if (column.id === targetColumnId) {
          targetColumnIndex = i;
        }

        if (!activeTodo) {
          const todoIndex = column.todos.findIndex((t) => t.id === activeId);
          if (todoIndex !== -1) {
            activeTodo = column.todos[todoIndex];
            sourceColumnId = column.id;
            sourceColumnIndex = i;
          }
        }

        if (activeTodo && targetColumnIndex !== -1 && sourceColumnId) break;
      }

      if (
        !activeTodo ||
        !sourceColumnId ||
        sourceColumnId === targetColumnId ||
        sourceColumnIndex === -1 ||
        targetColumnIndex === -1
      ) {
        return prevColumns;
      }

      const sourceColumn = prevColumns[sourceColumnIndex];
      const todoToMove = { ...activeTodo }; // Ensure we have a fresh copy

      return update(prevColumns, {
        [sourceColumnIndex]: {
          todos: {
            $splice: [
              [sourceColumn.todos.findIndex((todo) => todo.id === activeId), 1],
            ],
          },
        },
        [targetColumnIndex]: {
          todos: { $push: [todoToMove] },
        },
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

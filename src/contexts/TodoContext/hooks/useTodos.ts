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
      title: todo?.title ?? "", // Set empty title for new todos
      isFinished: todo?.isFinished ?? false,
      selected: todo?.selected ?? false,
      isNew: todo?.isNew ?? true, // Set isNew to true for new todos
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
    targetIndex?: number // This is the index in the target column's perspective
  ) => {
    setColumns((prevColumns) => {
      const sourceColumnIndex = prevColumns.findIndex(
        (col) => col.id === sourceColumnId
      );
      const targetColumnIndex = prevColumns.findIndex(
        (col) => col.id === targetColumnId
      );

      if (sourceColumnIndex === -1) return prevColumns; // Source column not found

      const sourceColumn = prevColumns[sourceColumnIndex];
      const activeTodo = sourceColumn.todos.find(
        (todo) => todo.id === activeId
      );

      if (!activeTodo) return prevColumns; // Active todo not found

      // Handle moving within the same column
      if (sourceColumnId === targetColumnId) {
        const currentTodos = sourceColumn.todos;
        const oldIndex = currentTodos.findIndex((t) => t.id === activeId);
        if (oldIndex === -1) return prevColumns;

        const newIndex = targetIndex;

        // If targetIndex is undefined or explicitly targeting the end (e.g., currentTodos.length)
        // it means move to the very end of the list.
        if (newIndex === undefined || newIndex >= currentTodos.length) {
          // Ensure it's not moving to its own position if already last and target is end
          if (
            oldIndex === currentTodos.length - 1 &&
            (newIndex === undefined || newIndex >= currentTodos.length)
          ) {
            return prevColumns; // Already at the end, no change
          }
          const itemToMove = currentTodos[oldIndex];
          // Create a new list by removing the item from its old position
          const tempTodos = update(currentTodos, { $splice: [[oldIndex, 1]] });
          // Add the item to the end of the temporary list
          const finalTodos = update(tempTodos, { $push: [itemToMove] });

          const newColumns = [...prevColumns];
          newColumns[sourceColumnIndex] = {
            ...sourceColumn,
            todos: finalTodos,
          };
          return newColumns;
        }

        // Standard reorder within the same column using a valid targetIndex
        if (newIndex !== undefined && oldIndex !== newIndex) {
          const reorderedTodos = arrayMove(currentTodos, oldIndex, newIndex);
          const newColumns = [...prevColumns];
          newColumns[sourceColumnIndex] = {
            ...sourceColumn,
            todos: reorderedTodos,
          };
          return newColumns;
        }
        return prevColumns; // No change needed if indices are same or targetIndex is invalid for this path
      } else {
        // Moving between different columns
        if (targetColumnIndex === -1) return prevColumns; // Target column not found

        const newColumns = [...prevColumns]; // Create a mutable copy of columns array

        // It's important to get fresh references to source and target columns from newColumns
        // if their indices could be the same due to a bug elsewhere, though here sourceColumnId !== targetColumnId.
        const currentSourceColumn = newColumns[sourceColumnIndex];
        // const currentTargetColumn = newColumns[targetColumnIndex]; // Unused variable

        // Remove from source
        const updatedSourceTodos = currentSourceColumn.todos.filter(
          (todo) => todo.id !== activeId
        );
        newColumns[sourceColumnIndex] = {
          ...currentSourceColumn,
          todos: updatedSourceTodos,
        };

        // Add to target
        // Must re-fetch targetColumn from newColumns array if sourceColumnIndex could equal targetColumnIndex
        // but since they are different, currentTargetColumn is fine.
        const updatedTargetTodos = [...newColumns[targetColumnIndex].todos]; // Use newColumns[targetColumnIndex] directly
        const insertIndex =
          targetIndex !== undefined ? targetIndex : updatedTargetTodos.length;
        updatedTargetTodos.splice(insertIndex, 0, {
          ...activeTodo,
          selected: false,
        });
        newColumns[targetColumnIndex] = {
          ...newColumns[targetColumnIndex],
          todos: updatedTargetTodos,
        };

        return newColumns;
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
          const todo = column.todos.find((t) => t.id === activeId);
          if (todo) {
            activeTodo = todo;
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

      const newColumns = [...prevColumns];

      const currentSourceColumn = newColumns[sourceColumnIndex];

      const updatedSourceTodos = currentSourceColumn.todos.filter(
        (todo) => todo.id !== activeId
      );
      newColumns[sourceColumnIndex] = {
        ...currentSourceColumn,
        todos: updatedSourceTodos,
      };

      const todoToMove: Todo = { ...activeTodo, selected: false };
      const finalTargetTodos = [
        ...newColumns[targetColumnIndex].todos,
        todoToMove,
      ];

      newColumns[targetColumnIndex] = {
        ...newColumns[targetColumnIndex],
        todos: finalTargetTodos,
      };

      return newColumns;
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

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import React, { useMemo } from "react";

import type { Todo } from "contexts/TodoContext/TodoContext.types";

import { ChangeableTitle } from "../ChangeableTitle";
import { TodoActions } from "./TodoActions";
import { useSortableTodoItem } from "./useTodoItem";

type TodoCardProps = {
  id: string;
  todo: Todo;
  parentId: string;
};

const TodoCard = React.memo(({ id, todo, parentId }: TodoCardProps) => {
  const {
    handleFinishedClick,
    handleRemoveClick,
    searchText,
    handleUpdateTodoName,
    select,
  } = useSortableTodoItem(id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { ...todo, parentId },
  });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0 : 1,
      zIndex: isDragging ? 1000 : "auto",
    }),
    [transform, transition, isDragging]
  );

  return (
    <div
      className={classNames(
        `mt-5 p-4 rounded-xl text-text text-xl flex flex-col 
         touch-manipulation`,
        {
          "bg-accent shadow-md hover:shadow-lg border border-transparent ring-2 ring-transparent":
            !todo.selected,
          "bg-ternary border-2 border-ternary shadow-lg ring-2 ring-ternary ring-opacity-50":
            todo.selected,
          "shadow-2xl": isDragging,
        }
      )}
      ref={setNodeRef}
      style={style}
    >
      <div className="flex justify-between items-center">
        <div>
          <input
            type="checkbox"
            className="mr-2 h-5 w-5 cursor-pointer"
            value={`${todo.selected}`}
            checked={todo.selected}
            onChange={(e) => {
              e.stopPropagation();
              select(parentId, id);
            }}
          />
        </div>
        <TodoActions
          draggableAttributes={attributes}
          draggableListeners={listeners}
          onFinishedClick={() => {
            handleFinishedClick(parentId, todo);
          }}
          onRemoveClick={() => {
            handleRemoveClick(parentId);
          }}
          isFinished={todo.isFinished}
        />
      </div>
      <ChangeableTitle
        title={todo.title}
        searchText={searchText}
        onUpdateTitle={(newTitle: string) =>
          handleUpdateTodoName(parentId, todo, newTitle)
        }
        testIdPrefix="todo"
        isNewTodo={todo.isNew}
      />
    </div>
  );
});

TodoCard.displayName = "TodoCard";

export { TodoCard };

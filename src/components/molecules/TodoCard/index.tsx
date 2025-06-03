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
        `bg-accent mt-5 p-4 rounded-xl
         text-text text-xl flex flex-col 
         touch-manipulation shadow-md hover:shadow-lg transition-shadow duration-200`,
        { "shadow-2xl": isDragging }
      )}
      ref={setNodeRef}
      style={style}
    >
      <div className="flex justify-between">
        <div>
          <input
            type="checkbox"
            value={`${todo.selected}`}
            checked={todo.selected}
            onChange={() => select(parentId, id)}
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
      />
    </div>
  );
});

TodoCard.displayName = "TodoCard";

export { TodoCard };

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

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.closest("[data-no-select]")) {
      return;
    }
    select(parentId, id);
  };

  return (
    <div
      className={classNames(
        `mt-5 p-4 rounded-xl text-text text-xl flex flex-col 
         touch-manipulation transition-all duration-200 cursor-pointer`,
        {
          "bg-accent shadow-md hover:shadow-lg": !todo.selected,
          "bg-primary border-2 border-primary shadow-lg ring-2 ring-primary ring-opacity-50":
            todo.selected,
          "shadow-2xl": isDragging,
        }
      )}
      ref={setNodeRef}
      style={style}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center" data-no-select>
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
        onClickTitle={() => select(parentId, id)}
      />
    </div>
  );
});

TodoCard.displayName = "TodoCard";

export { TodoCard };

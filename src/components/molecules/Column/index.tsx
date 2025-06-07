import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import { useMemo } from "react";
import React from "react";

import type { Todo } from "contexts/TodoContext/TodoContext.types";

import { Button } from "components/atoms/Button";

import { ColumnMenu } from "./ColumnMenu";
import { TodosDisplay } from "./TodosDisplay";

type ColumnProps = {
  title: string;
  todos: Todo[];
  id: string;
  onAddTodoClick?: (id: string) => void;
  onDeleteColumnClick?: (id: string) => void;
  onColumnNameChange?: (id: string, title: string) => void;
  onSelectAllClick?: (id: string) => void;
};

const Column = React.memo(
  ({
    title,
    todos,
    id,
    onAddTodoClick,
    onDeleteColumnClick,
    onColumnNameChange,
    onSelectAllClick,
  }: ColumnProps) => {
    const {
      attributes,
      listeners,
      setNodeRef: setSortableNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
      id: id,
    });

    // Combine refs for both sortable and droppable
    const setNodeRef = (element: HTMLElement | null) => {
      setSortableNodeRef(element);
      setDroppableNodeRef(element);
    };

    const style = useMemo(
      () => ({
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? "none" : transition,
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? 1000 : "auto",
      }),
      [transform, transition, isDragging]
    );

    return (
      <>
        <div
          className={classNames(
            `flex flex-col h-full rounded-xl bg-secondary py-6 px-8 
            shrink-0 touch-manipulation w-full overflow-auto md:w-[400px] first-of-type:ml-10`,
            {
              "shadow-2xl": isDragging,
            },
            "mb-5",
            {
              "ring-2 ring-accent ring-opacity-75":
                isOver && todos.length === 0,
            }
          )}
          ref={setNodeRef}
          style={style}
          {...attributes}
        >
          <ColumnMenu
            onDeleteColumnClick={onDeleteColumnClick}
            onSelectAllClick={onSelectAllClick}
            id={id}
            title={title}
            onColumnNameChange={(newTitle: string) => {
              if (onColumnNameChange) {
                onColumnNameChange(id, newTitle);
              }
            }}
            testIdPrefix="column"
            todoCount={todos.length}
            dragHandleProps={listeners}
          />
          <TodosDisplay id={id} todos={todos} />
          <Button
            className="bg-primary text-text font-bold text-xl mt-5 hover:!bg-accent"
            onClick={() => onAddTodoClick && onAddTodoClick(id)}
          >
            Add todo
          </Button>
        </div>
      </>
    );
  }
);

Column.displayName = "Column";

export { Column };

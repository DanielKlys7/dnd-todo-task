import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import cx from "classnames";

import type { Todo } from "contexts/TodoContext/TodoContext.types";

import { TodoCard } from "../TodoCard";
import { EmptyState } from "./EmptyState";

type TodosDisplayProps = {
  todos: Todo[];
  id: string;
};

export const TodosDisplay = ({ todos, id }: TodosDisplayProps) => {
  const { setNodeRef: setEmptyDropRef } = useDroppable({
    id: `${id}-empty`,
    data: { type: "column", columnId: id },
  });

  return (
    <div
      className={cx("flex flex-col", {
        "flex-1 min-h-[200px]": todos.length === 0,
      })}
    >
      <SortableContext items={todos} strategy={verticalListSortingStrategy}>
        {todos.length ? (
          todos.map((i) => (
            <TodoCard id={i.id} key={i.id} todo={i} parentId={id} />
          ))
        ) : (
          <EmptyState setEmptyDropRef={setEmptyDropRef} />
        )}
      </SortableContext>
    </div>
  );
};

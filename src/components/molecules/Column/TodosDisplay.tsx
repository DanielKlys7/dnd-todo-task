import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

import type { Todo } from "contexts/TodoContext/TodoContext.types";
import { useTodoContext } from "contexts/TodoContext/useTodoContext";

import { TodoCard } from "../TodoCard";
import EmptyLogo from "@components/atoms/svgs/Empty.svg?react";

type TodosDisplayProps = {
  todos: Todo[];
  id: string;
};

export const TodosDisplay = ({ todos, id }: TodosDisplayProps) => {
  const { setNodeRef: setEmptyDropRef } = useDroppable({
    id: `${id}-empty`,
    data: { type: "column", columnId: id },
  });
  const { searchText } = useTodoContext();

  return (
    <div
      className={`flex flex-col ${
        todos.length === 0 ? "flex-1 min-h-[200px]" : ""
      }`}
    >
      <SortableContext items={todos} strategy={verticalListSortingStrategy}>
        {todos.length ? (
          todos.map((i) => (
            <TodoCard id={i.id} key={i.id} todo={i} parentId={id} />
          ))
        ) : (
          <div
            ref={setEmptyDropRef}
            className="text-center text-2xl py-8 lg:py-20 flex-1 flex flex-col items-center justify-center"
          >
            <EmptyLogo className="fill-red-500 text-color-text opacity-50 w-1/2 h-1/2" />
            <p className="mt-4 text-color-text opacity-75">
              {searchText
                ? "No tasks match your search."
                : "Nothing here yet. Add a new task!"}
            </p>
          </div>
        )}
      </SortableContext>
    </div>
  );
};

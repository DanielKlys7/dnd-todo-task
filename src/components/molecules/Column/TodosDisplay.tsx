import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { Todo } from "contexts/TodoContext/TodoContext.types";

import { TodoCard } from "../TodoCard";

type TodosDisplayProps = {
  todos: Todo[];
  id: string;
};

export const TodosDisplay = ({ todos, id }: TodosDisplayProps) => {
  return (
    <div className="flex flex-col">
      <SortableContext items={todos} strategy={verticalListSortingStrategy}>
        {todos.length ? (
          todos.map((i) => (
            <TodoCard id={i.id} key={i.id} todo={i} parentId={id} />
          ))
        ) : (
          <div className="text-center text-2xl py-8 lg:py-20">
            There is nothing to see here ¯\_(ツ)_/¯
          </div>
        )}
      </SortableContext>
    </div>
  );
};

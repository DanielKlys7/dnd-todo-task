import classNames from "classnames";
import React from "react";

import type { Todo } from "contexts/TodoContext/TodoContext.types";

import { Button } from "components/atoms/Button";

import { ColumnMenu } from "./ColumnMenu";
import { TodosDisplay } from "./TodosDisplay";
import { useColumn } from "./useColumn";

type ColumnProps = {
  title: string;
  todos: Todo[];
  id: string;
  isNew?: boolean;
};

const Column = React.memo(
  ({
    title,
    todos,
    id,

    isNew,
  }: ColumnProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      style,
      handleAddTodo,
      handleColumnNameChange,
    } = useColumn(id);

    return (
      <div
        className={classNames(
          `flex flex-col h-full rounded-xl bg-secondary py-6 px-8 
            shrink-0 touch-manipulation w-full overflow-auto md:w-[400px]`
        )}
        ref={setNodeRef}
        style={style}
        data-testid={`column-${id}`}
        {...attributes}
      >
        <ColumnMenu
          id={id}
          title={title}
          onColumnNameChange={(newTitle: string) => {
            handleColumnNameChange(newTitle);
          }}
          testIdPrefix="column"
          todoCount={todos.length}
          dragHandleProps={listeners}
          isNewColumn={isNew}
          onColumnInitialChangeName={handleColumnNameChange}
        />

        <div className="flex-1 min-h-0 overflow-y-auto">
          <TodosDisplay id={id} todos={todos} />
        </div>

        <Button
          className="bg-primary text-text font-bold text-xl mt-5 hover:!bg-accent"
          onClick={handleAddTodo}
        >
          Add todo
        </Button>
      </div>
    );
  }
);

Column.displayName = "Column";

export { Column };

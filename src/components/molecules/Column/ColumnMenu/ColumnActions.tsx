import { Draggable } from "components/atoms/icons";
import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline"; // Added TrashIcon import
import { useTodoContext } from "contexts/TodoContext/useTodoContext";

export type ActionItem = {
  id: string;
  onClick: () => void;
  className?: string;
  title?: string;
  "data-testid"?: string;
  content: React.ReactNode;
  isVisible?: boolean;
};

type ColumnActionsProps = {
  id: string;
  testIdPrefix?: string;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement> & {
    "data-cypress"?: string;
  };
  todoCount?: number;
};

export const ColumnActions = ({
  dragHandleProps,
  id,
  testIdPrefix,
  todoCount = 0,
}: ColumnActionsProps) => {
  const { deleteColumn, selectAllInColumn } = useTodoContext();

  const columnActions: ActionItem[] = [
    {
      id: "select-all",
      onClick: () => selectAllInColumn && selectAllInColumn(id),
      className:
        "px-3 py-1.5 text-sm bg-accent text-text hover:bg-primary rounded-lg transition-all duration-300 font-medium whitespace-nowrap",
      "data-testid": `${testIdPrefix}-select-all`,
      content: "Select all",
      isVisible: !!selectAllInColumn && todoCount > 1,
    },
    {
      id: "delete-column",
      onClick: () => deleteColumn && deleteColumn(id),
      className:
        "p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors",
      title: "Delete column",
      "data-testid": "deleteColumn",
      content: <TrashIcon className="w-5 h-5" />,
      isVisible: !!deleteColumn,
    },
  ];

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <div className="flex items-center gap-1">
        {columnActions
          .filter((action) => action.isVisible)
          .map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={action.className}
              title={action.title}
              data-testid={action["data-testid"]}
            >
              {action.content}
            </button>
          ))}
        {dragHandleProps && (
          <button
            {...dragHandleProps}
            tabIndex={dragHandleProps.tabIndex}
            className="cursor-grab active:cursor-grabbing flex-shrink-0 p-1 hover:bg-gray-100 rounded-md transition-colors border-0 bg-transparent"
            title="Drag to reorder column"
            aria-label="Drag to reorder column"
            type="button"
          >
            <Draggable className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};

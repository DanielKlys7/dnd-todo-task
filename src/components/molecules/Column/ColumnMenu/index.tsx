import { TrashIcon } from "@heroicons/react/24/outline";
import { Draggable } from "components/atoms/icons";
import { ChangeableTitle } from "components/molecules/ChangeableTitle";

type ColumnMenuProps = {
  onDeleteColumnClick: ((id: string) => void) | undefined;
  onSelectAllClick: ((id: string) => void) | undefined;
  id: string;
  title: string;
  onColumnNameChange?: (newTitle: string) => void;
  onColumnInitialChangeName?: (id: string) => void;
  testIdPrefix?: string;
  isNewColumn?: boolean;
  todoCount?: number;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement> & {
    "data-cypress"?: string;
  };
};

export const ColumnMenu = ({
  onDeleteColumnClick,
  onSelectAllClick,
  id,
  title,
  onColumnNameChange,
  testIdPrefix,
  isNewColumn = false,
  todoCount = 0,
  dragHandleProps,
}: ColumnMenuProps) => {
  return (
    <div className="flex items-center justify-between gap-3 group">
      <ChangeableTitle
        title={title}
        onUpdateTitle={(newTitle) => {
          if (onColumnNameChange) {
            onColumnNameChange(newTitle);
          }
        }}
        testIdPrefix={`${testIdPrefix}-column`}
        isInline={true}
        isNewColumn={isNewColumn}
      />

      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="flex items-center gap-1">
          {onSelectAllClick && todoCount > 1 && (
            <button
              onClick={() => onSelectAllClick(id)}
              className="px-3 py-1.5 text-sm bg-accent text-text hover:bg-primary rounded-lg transition-all duration-300 font-medium whitespace-nowrap"
              data-testid={`${testIdPrefix}-select-all`}
            >
              Select all
            </button>
          )}

          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing flex-shrink-0 p-1 hover:bg-gray-100 rounded-md transition-colors"
            title="Drag to reorder column"
          >
            <Draggable className="w-5 h-5 text-gray-400" />
          </div>

          {onDeleteColumnClick && (
            <button
              onClick={() => onDeleteColumnClick(id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete column"
              data-testid={`${testIdPrefix}-delete`}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

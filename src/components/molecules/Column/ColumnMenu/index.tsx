import { useState, useRef, useEffect } from "react";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Draggable } from "components/atoms/icons";

type ColumnMenuProps = {
  onDeleteColumnClick: ((id: string) => void) | undefined;
  onSelectAllClick: ((id: string) => void) | undefined;
  id: string;
  title: string;
  onColumnNameChange?: (newTitle: string) => void;
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
  const [isEditing, setIsEditing] = useState(
    isNewColumn || title === "New Column"
  );
  const [tempTitle, setTempTitle] = useState(title || "New Column");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((isNewColumn || title === "New Column") && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isNewColumn, title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleSave = () => {
    if (tempTitle.trim() && onColumnNameChange) {
      onColumnNameChange(tempTitle.trim());
      setIsEditing(false);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    }
    if (e.key === "Escape") {
      setTempTitle(title);
      setIsEditing(false);
    }
  };

  const handleTitleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 group">
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="flex-1 text-lg font-semibold bg-transparent border-b-2 border-blue-500 focus:outline-none pb-1 min-w-0"
              placeholder="Column name"
              data-testid={`${testIdPrefix}-title-input`}
            />
            <button
              onClick={handleTitleSave}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex-shrink-0"
              title="Save"
              data-testid={`${testIdPrefix}-save-title`}
            >
              <CheckIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <h2
            className="text-lg font-semibold cursor-pointer hover:text-blue-600 transition-colors truncate border-b-2 border-transparent pb-1"
            onClick={handleTitleClick}
            title={title}
            data-testid={`${testIdPrefix}-title`}
          >
            {title}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="flex items-center gap-1">
          {onSelectAllClick && todoCount > 1 && (
            <button
              onClick={() => onSelectAllClick(id)}
              className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-all font-medium whitespace-nowrap"
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

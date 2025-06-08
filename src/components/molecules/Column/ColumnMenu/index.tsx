import { ChangeableTitle } from "components/molecules/ChangeableTitle";
import { ColumnActions } from "./ColumnActions";

type ColumnMenuProps = {
  id: string;
  title: string;
  onColumnNameChange?: (newTitle: string) => void;
  onColumnInitialChangeName?: (id: string) => void;
  testIdPrefix?: string;
  isNewColumn?: boolean;
  todoCount?: number;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement> & {
    "data-cypress"?: string;
  };
};

export const ColumnMenu = ({
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
        isNew={isNewColumn}
      />

      <ColumnActions
        id={id}
        dragHandleProps={dragHandleProps}
        testIdPrefix={testIdPrefix}
        todoCount={todoCount}
      />
    </div>
  );
};

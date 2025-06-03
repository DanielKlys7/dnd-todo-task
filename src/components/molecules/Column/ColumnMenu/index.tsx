import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import { ChangeableTitle } from "components/molecules/ChangeableTitle";

import { ColumnActions } from "./ColumnActions";

type ColumnMenuProps = {
  onDeleteColumnClick: ((id: string) => void) | undefined;
  onSelectAllClick: ((id: string) => void) | undefined;
  id: string;
  draggableAttributes: DraggableAttributes;
  draggableListeners: SyntheticListenerMap | undefined;
  title: string;
  onColumnNameChange?: (newTitle: string) => void;
  testIdPrefix?: string;
};

export const ColumnMenu = ({
  onDeleteColumnClick,
  onSelectAllClick,
  id,
  draggableAttributes,
  draggableListeners,
  title,
  onColumnNameChange,
  testIdPrefix,
}: ColumnMenuProps) => {
  return (
    <div className="flex flex-col justify-between">
      <ColumnActions
        onDeleteColumnClick={onDeleteColumnClick}
        onSelectAllClick={onSelectAllClick}
        id={id}
        draggableAttributes={draggableAttributes}
        draggableListeners={draggableListeners}
      />
      <ChangeableTitle
        title={title}
        onUpdateTitle={(newTitle: string) => {
          if (onColumnNameChange) {
            onColumnNameChange(newTitle);
          }
        }}
        testIdPrefix={testIdPrefix}
      />
    </div>
  );
};

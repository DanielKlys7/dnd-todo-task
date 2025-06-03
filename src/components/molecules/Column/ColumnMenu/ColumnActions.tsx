import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useMemo } from "react";

import { Button } from "components/atoms/Button";
import { Bin, Draggable } from "components/atoms/icons";

import { Actions } from "../../Actions";
import type { ActionItem } from "../../Actions/Action.types";

type ColumnActionsProps = {
  onDeleteColumnClick?: (id: string) => void;
  id: string;
  onSelectAllClick?: (id: string) => void;
  draggableAttributes: DraggableAttributes;
  draggableListeners: SyntheticListenerMap | undefined;
};

export const ColumnActions = ({
  onDeleteColumnClick,
  id,
  onSelectAllClick,
  draggableAttributes,
  draggableListeners,
}: ColumnActionsProps) => {
  const actionItems: ActionItem[] = useMemo(
    () => [
      {
        component: <Draggable />,
        isDraggable: true,
        id: "drag",
        testId: "dragColumn",
      },
      {
        component: <Bin />,
        onClick: () => onDeleteColumnClick && onDeleteColumnClick(id),
        id: "delete",
        testId: "deleteColumn",
      },
      {
        component: (
          <Button
            onClick={() => onSelectAllClick && onSelectAllClick(id)}
            className="!bg-transparent border !border-black ml-3"
          >
            Select all
          </Button>
        ),
        id: "selectAll",
        testId: "selectAllColumn",
      },
    ],
    [onDeleteColumnClick, id, onSelectAllClick]
  );

  return (
    <Actions
      actionItems={actionItems}
      draggableAttributes={draggableAttributes}
      draggableListeners={draggableListeners}
    />
  );
};

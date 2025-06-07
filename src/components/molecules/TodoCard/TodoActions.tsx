import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useMemo } from "react";

import { Bin, Check, Draggable } from "components/atoms/icons";

import { Actions } from "../Actions";

type TodoActionsProps = {
  onRemoveClick: () => void;
  onFinishedClick: () => void;
  draggableAttributes: DraggableAttributes;
  draggableListeners: SyntheticListenerMap | undefined;
  isFinished: boolean;
};

export const TodoActions = ({
  onRemoveClick,
  onFinishedClick,
  draggableAttributes,
  draggableListeners,
  isFinished,
}: TodoActionsProps) => {
  const actionItems = useMemo(
    () => [
      {
        component: <Draggable />,
        isDraggable: true,
        id: "drag",
        testId: "dragTodo",
      },
      {
        component: <Bin />,
        onClick: onRemoveClick,
        id: "delete",
        testId: "deleteTodo",
      },
      {
        component: <Check />,
        onClick: onFinishedClick,
        id: "finish",
        className: isFinished ? "text-primary" : "text-accent",
        testId: "finishTodo",
      },
    ],
    [isFinished, onFinishedClick, onRemoveClick]
  );

  return (
    <div className="flex items-center space-x-2" data-no-select>
      <Actions
        actionItems={actionItems}
        draggableAttributes={draggableAttributes}
        draggableListeners={draggableListeners}
      />
    </div>
  );
};

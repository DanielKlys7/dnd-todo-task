import type { ActionsProps } from "./Action.types";

export const Actions = ({
  actionItems,
  draggableAttributes,
  draggableListeners,
}: ActionsProps) => {
  return (
    <div className="flex self-end items-center">
      {actionItems.map(
        ({ onClick, className, isDraggable, component, testId }, index) => (
          <span
            key={index}
            onClick={onClick}
            className={`cursor-pointer ${className}`}
            {...(isDraggable
              ? { ...draggableAttributes, ...draggableListeners }
              : {})}
            role="menuitem"
            data-testid={testId}
          >
            {component}
          </span>
        )
      )}
    </div>
  );
};

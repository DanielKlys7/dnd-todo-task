import type { ActionsProps } from "./Action.types";

export const Actions = ({
  actionItems,
  draggableAttributes,
  draggableListeners,
}: ActionsProps) => {
  return (
    <>
      {actionItems.map(
        ({ onClick, className, isDraggable, component, testId }) => (
          <span
            key={testId}
            onClick={onClick}
            className={`cursor-pointer hover:bg-secondary p-1 rounded-sm  ${className}`}
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
    </>
  );
};

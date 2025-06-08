import type { ActionsProps } from "./Action.types";

export const Actions = ({
  actionItems,
  draggableAttributes,
  draggableListeners,
}: ActionsProps) => {
  return (
    <>
      {actionItems.map(
        ({ onClick, className, isDraggable, component, testId }) => {
          if (isDraggable) {
            return (
              <button
                key={testId}
                className={`cursor-pointer hover:bg-secondary p-1 rounded-sm border-0 bg-transparent ${className}`}
                {...(draggableAttributes as unknown as React.HTMLAttributes<HTMLButtonElement>)}
                {...(draggableListeners as unknown as React.HTMLAttributes<HTMLButtonElement>)}
                data-testid={testId}
                aria-label="Drag to reorder"
                type="button"
              >
                {component}
              </button>
            );
          }

          return (
            <span
              key={testId}
              onClick={onClick}
              className={`cursor-pointer hover:bg-secondary p-1 rounded-sm  ${className}`}
              role="menuitem"
              data-testid={testId}
            >
              {component}
            </span>
          );
        }
      )}
    </>
  );
};

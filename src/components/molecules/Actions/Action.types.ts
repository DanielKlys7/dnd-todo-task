import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export type ActionItem = {
  component: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isDraggable?: boolean;
  id: string;
  testId?: string;
};

export type ActionsProps = {
  actionItems: ActionItem[];
  draggableAttributes: DraggableAttributes;
  draggableListeners: SyntheticListenerMap | undefined;
};

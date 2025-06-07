import EmptyLogo from "@components/atoms/svgs/Empty.svg?react";
import { useTodoContext } from "contexts/TodoContext/useTodoContext";
import { FilterStatus } from "contexts/TodoContext/TodoContext.types";

type EmptyStateProps = {
  setEmptyDropRef: (element: HTMLElement | null) => void;
};

export const EmptyState = ({ setEmptyDropRef }: EmptyStateProps) => {
  const { searchText, filterStatus } = useTodoContext();

  return (
    <div
      ref={setEmptyDropRef}
      className="text-center text-2xl py-8 lg:py-20 flex-1 flex flex-col items-center justify-center"
    >
      <EmptyLogo className="text-text opacity-50 w-1/2 h-1/2" />
      <p className="mt-4 text-color-text opacity-75">
        {searchText || filterStatus !== FilterStatus.ALL
          ? "No tasks match your query."
          : "Nothing here yet. Add a new task!"}
      </p>
    </div>
  );
};

import type {
  Column,
  FilterStatus,
} from "contexts/TodoContext/TodoContext.types";

import { Select } from "components/atoms/Select";

export const SearchAndFilterBar = ({
  filterStatus,
  onSearch,
  onFilterChange,
  options,
}: {
  columns: Column[];
  filterStatus: string;
  onSearch: (search: string) => void;
  onFilterChange: (filter: FilterStatus) => void;
  onDeleteSelectedClick: () => void;
  onMarkSelectedAsFinishedClick: () => void;
  onMarkSelectedAsUnfinishedClick: () => void;
  options: FilterStatus[];
  onMoveSelectedClick: (targetColumnId: string) => void;
}) => {
  return (
    <>
      <label className="sr-only" htmlFor="search">
        Search for todos
      </label>
      <input
        type="text"
        placeholder="Search todos"
        onChange={(e) => onSearch(e.target.value)}
        className="px-4 py-3 border border-primary rounded-md focus:outline-none 
        focus:ring-2 focus:ring-accent h-12 text-text placeholder:text-neutral-400"
      />

      <Select
        options={options.map((i) => ({ value: i, label: i }))}
        value={filterStatus}
        onChange={(value) => onFilterChange(value as FilterStatus)}
      />
    </>
  );
};

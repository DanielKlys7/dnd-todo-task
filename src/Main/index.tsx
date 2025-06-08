import {
  DndContext,
  DragOverlay,
  rectIntersection,
  defaultDropAnimation,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import {
  type Column as ColumnType,
  FilterStatus,
} from "@contexts/TodoContext/TodoContext.types";
import { useTodoContext } from "@contexts/TodoContext/useTodoContext";

import { Button } from "@components/atoms/Button";
import { Container } from "@components/atoms/Container";
import { CreateColumn } from "@components/atoms/CreateColumn";
import DropdownMenu from "@components/atoms/DropdownMenu";
import { Menu } from "@components/atoms/Menu";
import { ThemeToggle } from "@components/atoms/ThemeToggle";
import { Column } from "@components/molecules/Column";
import { SearchAndFilterBar } from "@components/molecules/SearchAndFilterBar";
import { TodoCard } from "@components/molecules/TodoCard";

import { useMain } from "./useMain";

const renderDragOverlay = (activeId: string | null, columns: ColumnType[]) => {
  if (!activeId) return null;
  const itemType = activeId.indexOf("todo") > -1 ? "todo" : "col";

  if (itemType === "todo") {
    const todoToDisplay = columns
      .flatMap((i) => i.todos)
      .find((i) => i.id === activeId);

    if (!todoToDisplay) return;

    return (
      <TodoCard id={todoToDisplay.id} todo={todoToDisplay} parentId={""} />
    );
  }

  if (itemType === "col") {
    const columnToDisplay = columns.find((i) => i.id === activeId);

    return (
      <Column
        title={columnToDisplay?.title || ""}
        todos={columnToDisplay?.todos || []}
        id={columnToDisplay?.id || ""}
      />
    );
  }
};

export const Main = () => {
  const { activeId, sensors, onDragStart, onDragEnd } = useMain();
  const {
    columns,
    addColumn,
    searchTodos,
    filterStatus,
    setFilterStatus,
    deleteSelected,
    setFinishedStatusOfSelected,
    moveSelected,
  } = useTodoContext();

  const hasSelectedItems = columns.some((column) =>
    column.todos.some((todo) => todo.selected)
  );

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background text-text">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        collisionDetection={rectIntersection}
      >
        <Container>
          <Menu>
            <div className="flex items-center w-full mb-2 lg:mb-5 gap-2">
              <SearchAndFilterBar
                onSearch={searchTodos}
                onFilterChange={setFilterStatus}
                filterStatus={filterStatus}
                options={[
                  FilterStatus.ALL,
                  FilterStatus.FINISHED,
                  FilterStatus.UNFINISHED,
                ]}
                onDeleteSelectedClick={deleteSelected}
                onMarkSelectedAsFinishedClick={() =>
                  setFinishedStatusOfSelected(true)
                }
                onMarkSelectedAsUnfinishedClick={() =>
                  setFinishedStatusOfSelected(false)
                }
                columns={columns}
                onMoveSelectedClick={moveSelected}
              />
            </div>

            <div className="flex flex-row w-full flex-wrap items-center gap-2 justify-start lg:justify-end">
              <Button
                onClick={deleteSelected}
                disabled={!hasSelectedItems}
                aria-label="Delete selected todos"
                data-testid="main-delete-button"
              >
                Delete
              </Button>
              <Button
                onClick={() => setFinishedStatusOfSelected(true)}
                disabled={!hasSelectedItems}
                aria-label="Mark selected todos as done"
                data-testid="main-mark-done-button"
              >
                Mark Done
              </Button>
              <Button
                onClick={() => setFinishedStatusOfSelected(false)}
                disabled={!hasSelectedItems}
                aria-label="Mark selected todos as undone"
                data-testid="main-mark-undone-button"
              >
                Mark Undone
              </Button>

              <DropdownMenu
                options={columns.map((i) => ({
                  value: i.id,
                  label: i.title,
                  onClick: () => moveSelected(i.id),
                }))}
                disabled={!hasSelectedItems}
              />

              <ThemeToggle />
            </div>
          </Menu>

          <div className="w-full h-full flex gap-10 p-6 overflow-auto">
            <SortableContext
              items={[...columns]}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((i) => (
                <Column
                  key={i.id}
                  title={i.title}
                  todos={i.todos}
                  id={i.id}
                  isNew={i.isNew}
                />
              ))}
            </SortableContext>
            <CreateColumn onAddColumnClick={addColumn} />
          </div>
        </Container>

        {createPortal(
          <DragOverlay dropAnimation={defaultDropAnimation}>
            {renderDragOverlay(activeId, columns)}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

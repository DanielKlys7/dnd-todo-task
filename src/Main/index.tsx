import {
  DndContext,
  DragOverlay,
  closestCorners, // Changed from rectIntersection
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
  const { activeId, sensors, onDragStart, onDragEnd, animateDrop } = useMain();
  const {
    columns,
    addColumn,
    deleteColumn,
    addTodo,
    searchTodos,
    updateColumnTitle,
    filterStatus,
    setFilterStatus,
    selectAllInColumn,
    deleteSelected,
    setFinishedStatusOfSelected,
    moveSelected,
  } = useTodoContext();

  const hasSelectedItems = columns.some((column) =>
    column.todos.some((todo) => todo.selected)
  );

  const dropAnimationConfig = animateDrop ? defaultDropAnimation : null; // Conditionally set drop animation

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background text-text">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        collisionDetection={closestCorners} // Changed from rectIntersection
      >
        <Container>
          <Menu>
            <div className="flex justify-between items-center mb-4">
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

            <Button onClick={deleteSelected} disabled={!hasSelectedItems}>
              Delete
            </Button>
            <Button
              onClick={() => setFinishedStatusOfSelected(true)}
              disabled={!hasSelectedItems}
            >
              Mark Done
            </Button>
            <Button
              onClick={() => setFinishedStatusOfSelected(false)}
              disabled={!hasSelectedItems}
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
          </Menu>

          <div className="w-full h-full flex gap-12 my-10 overflow-auto">
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
                  onDeleteColumnClick={deleteColumn}
                  onAddTodoClick={addTodo}
                  onColumnNameChange={updateColumnTitle}
                  onSelectAllClick={selectAllInColumn}
                />
              ))}
              <CreateColumn onAddColumnClick={addColumn} />
            </SortableContext>
          </div>
        </Container>

        {createPortal(
          <DragOverlay dropAnimation={dropAnimationConfig}>
            {renderDragOverlay(activeId, columns)}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

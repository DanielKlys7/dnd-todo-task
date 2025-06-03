export type Todo = {
  id: string
  title: string
  isFinished: boolean
  selected: boolean
}

export type Column = {
  id: string
  title: string
  todos: Todo[]
}

export enum FilterStatus {
  ALL = 'all',
  FINISHED = 'finished',
  UNFINISHED = 'unfinished',
}

export type TodoContext = {
  columns: Column[]
  addTodo: (columnId: string, todo?: Todo) => void
  removeTodo: (columnId: string, todoId: string) => void
  updateTodo: (columnId: string, todoId: string, todo: Todo) => void
  addColumn: () => void
  deleteColumn: (id: string) => void
  moveTodoInColumn: (todoId: string, behindId: string) => void
  reorderTodosInColumn: (columnId: string, activeId: string, overId: string) => void
  moveTodoBetweenColumns: (
    activeId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetIndex?: number
  ) => void
  moveTodoToColumn: (activeId: string, targetColumnId: string) => void
  moveColumn: (columnId: string, behindId: string) => void
  reorderColumns: (activeId: string, overId: string) => void
  searchTodos: (text: string) => void
  searchText: string
  updateColumnTitle: (columnId: string, newTitle: string) => void
  filterStatus: FilterStatus
  setFilterStatus: (status: FilterStatus) => void
  selectAllInColumn: (columnId: string) => void
  deleteSelected: () => void
  setFinishedStatusOfSelected: (isFinished: boolean) => void
  moveSelected: (targetColumnId: string) => void
  select: (columnId: string, todoId: string) => void
}

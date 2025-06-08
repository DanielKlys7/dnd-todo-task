import { v4 as uuidv4 } from "uuid";
import type { Todo, Column } from "../contexts/TodoContext/TodoContext.types";

export const createTestTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: `todo-${uuidv4()}`,
  title: "Test Todo",
  isFinished: false,
  selected: false,
  isNew: false,
  ...overrides,
});

export const createTestColumn = (overrides: Partial<Column> = {}): Column => ({
  id: `col-${uuidv4()}`,
  title: "Test Column",
  todos: [],
  isNew: false,
  ...overrides,
});

export const createTestTodos = (
  count: number,
  overrides: Partial<Todo> = {}
): Todo[] => {
  return Array.from({ length: count }, (_, index) =>
    createTestTodo({
      title: `Test Todo ${index + 1}`,
      ...overrides,
    })
  );
};

export const createTestColumns = (
  count: number,
  overrides: Partial<Column> = {}
): Column[] => {
  return Array.from({ length: count }, (_, index) =>
    createTestColumn({
      title: `Test Column ${index + 1}`,
      ...overrides,
    })
  );
};

export const createTestColumnWithTodos = (
  todoCount: number = 3,
  columnOverrides: Partial<Column> = {},
  todoOverrides: Partial<Todo> = {}
): Column => {
  const todos = createTestTodos(todoCount, todoOverrides);
  return createTestColumn({
    todos,
    ...columnOverrides,
  });
};

// Helper functions for more convenient test data creation
export const createTodoWithTitle = (
  title: string,
  overrides: Partial<Todo> = {}
): Todo => createTestTodo({ title, ...overrides });

export const createColumnWithTodos = (
  title: string,
  todos: Todo[],
  overrides: Partial<Column> = {}
): Column => createTestColumn({ title, todos, ...overrides });

export const createColumnWithTodoTitles = (
  columnTitle: string,
  todoTitles: string[],
  overrides: Partial<Column> = {}
): Column => {
  const todos = todoTitles.map((title) => createTodoWithTitle(title));
  return createTestColumn({ title: columnTitle, todos, ...overrides });
};

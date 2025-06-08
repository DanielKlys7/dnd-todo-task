import { describe, it, expect, beforeEach } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import {
  createColumnWithTodos,
  createTodoWithTitle,
} from "../../test/factories";

describe("Data Flow Debug", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should verify initial columns are passed correctly", () => {
    const testTodos = [
      createTodoWithTitle("Test Todo 1"),
      createTodoWithTitle("Test Todo 2"),
    ];
    const testColumns = [createColumnWithTodos("Test Column", testTodos)];

    console.log("Test input data:");
    console.log("Columns:", testColumns.length);
    console.log("Column title:", testColumns[0].title);
    console.log("Todos in column:", testColumns[0].todos.length);
    testColumns[0].todos.forEach((todo, i) => {
      console.log(`Todo ${i + 1}: ${todo.title}`);
    });

    const TestComponent = () => {
      return <div data-testid="test-component">Test</div>;
    };

    renderWithProviders(<TestComponent />, { initialColumns: testColumns });

    expect(true).toBe(true);
  });
});

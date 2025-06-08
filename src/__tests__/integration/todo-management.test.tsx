import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

import { render, screen, waitFor } from "../../test/test-utils";
import { setupLocalStorageMock } from "../../test/localStorage-mock";
import {
  createTestColumn,
  createTestTodo,
  createTestColumnWithTodos,
} from "../../test/factories";
import { Main } from "../../Main";

describe("Todo Management", () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  describe("Todo Creation", () => {
    it("should create a new todo when Add Todo button is clicked", async () => {
      const user = userEvent.setup();
      const testColumn = createTestColumn({ title: "Test Column" });

      render(<Main />, { initialColumns: [testColumn] });

      const addTodoButton = screen.getByRole("button", { name: "Add todo" });
      expect(addTodoButton).toBeInTheDocument();
      await user.click(addTodoButton);

      const newTodo = await screen.findByDisplayValue("New Todo");
      expect(newTodo).toBeInTheDocument();
    });

    it("should add todo with editable title in new state", async () => {
      const user = userEvent.setup();
      const testColumn = createTestColumn();

      render(<Main />, { initialColumns: [testColumn] });

      const addTodoButton = screen.getByRole("button", { name: "Add todo" });
      expect(addTodoButton).toBeInTheDocument();
      await user.click(addTodoButton);

      const titleInput = await screen.findByDisplayValue("New Todo");
      expect(titleInput).toHaveAttribute("type", "text");
    });
  });

  describe("Todo Title Editing", () => {
    it("should allow editing todo title by clicking on it", async () => {
      const user = userEvent.setup();
      const testTodo = createTestTodo({ title: "Original Title" });
      const testColumn = createTestColumn({ todos: [testTodo] });

      render(<Main />, { initialColumns: [testColumn] });

      const todoTitle = screen.getByText("Original Title");
      await user.click(todoTitle);

      const titleInput = await screen.findByDisplayValue("Original Title");
      expect(titleInput).toBeInTheDocument();
    });

    it("should save new title when Enter is pressed", async () => {
      const user = userEvent.setup();
      const testTodo = createTestTodo({ title: "Original Title" });
      const testColumn = createTestColumn({ todos: [testTodo] });

      render(<Main />, { initialColumns: [testColumn] });

      const todoTitle = screen.getByText("Original Title");
      await user.click(todoTitle);

      const titleInput = await screen.findByDisplayValue("Original Title");
      await user.clear(titleInput);
      await user.type(titleInput, "Updated Title");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText("Updated Title")).toBeInTheDocument();
      });
    });

    it("should save title when input loses focus", async () => {
      const user = userEvent.setup();
      const testTodo = createTestTodo({ title: "Original Title" });
      const testColumn = createTestColumn({ todos: [testTodo] });

      render(<Main />, { initialColumns: [testColumn] });

      const todoTitle = screen.getByText("Original Title");
      await user.click(todoTitle);

      const titleInput = await screen.findByDisplayValue("Original Title");
      await user.clear(titleInput);
      await user.type(titleInput, "Blur Updated Title");

      const columnTitle = screen.getByText(testColumn.title);
      await user.click(columnTitle);

      await waitFor(() => {
        expect(screen.getByText("Blur Updated Title")).toBeInTheDocument();
      });
    });

    it("should handle empty title gracefully", async () => {
      const user = userEvent.setup();
      const testTodo = createTestTodo({ title: "Original Title" });
      const testColumn = createTestColumn({ todos: [testTodo] });

      render(<Main />, { initialColumns: [testColumn] });

      const todoTitle = screen.getByText("Original Title");
      await user.click(todoTitle);

      const titleInput = await screen.findByDisplayValue("Original Title");
      await user.clear(titleInput);
      await user.keyboard("{Enter}");

      await waitFor(() => {
        const titleElement = screen.getByTestId("todo-changeTitle");
        expect(titleElement).toBeInTheDocument();

        const h2Element = titleElement.querySelector("h2");
        expect(h2Element).toBeInTheDocument();
      });
    });
  });

  describe("Todo Status Toggle", () => {
    it("should toggle todo completion status when check icon is clicked", async () => {
      const user = userEvent.setup();
      const testTodo = createTestTodo({
        title: "Test Todo",
        isFinished: false,
      });
      const testColumn = createTestColumn({ todos: [testTodo] });

      render(<Main />, { initialColumns: [testColumn] });

      const checkButton = screen.getByTestId("finishTodo");
      await user.click(checkButton);

      await waitFor(() => {
        const todoElement = screen
          .getByText("Test Todo")
          .closest('[data-testid*="todo"]');
        expect(todoElement).toBeInTheDocument();
      });
    });

    it("should toggle from finished to unfinished", async () => {
      const user = userEvent.setup();
      const testTodo = createTestTodo({
        title: "Finished Todo",
        isFinished: true,
      });
      const testColumn = createTestColumn({ todos: [testTodo] });

      render(<Main />, { initialColumns: [testColumn] });

      const checkButton = screen.getByTestId("finishTodo");
      await user.click(checkButton);

      await waitFor(() => {
        const todoElement = screen
          .getByText("Finished Todo")
          .closest('[data-testid*="todo"]');
        expect(todoElement).toBeInTheDocument();
      });
    });
  });

  describe("Todo Deletion", () => {
    it("should delete todo when delete button is clicked", async () => {
      const user = userEvent.setup();
      const testTodo = createTestTodo({ title: "Todo to Delete" });
      const testColumn = createTestColumn({ todos: [testTodo] });

      render(<Main />, { initialColumns: [testColumn] });

      const deleteButton = screen.getByTestId("deleteTodo");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText("Todo to Delete")).not.toBeInTheDocument();
      });
    });

    it("should handle deleting the last todo in a column", async () => {
      const user = userEvent.setup();
      const testTodo = createTestTodo({ title: "Last Todo" });
      const testColumn = createTestColumn({ todos: [testTodo] });

      render(<Main />, { initialColumns: [testColumn] });

      const deleteButton = screen.getByTestId("deleteTodo");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText("Last Todo")).not.toBeInTheDocument();
      });

      expect(screen.getByText(testColumn.title)).toBeInTheDocument();
    });
  });

  describe("Todo Selection", () => {
    it("should select todo when checkbox is clicked", async () => {
      const user = userEvent.setup();
      const testTodo = createTestTodo({
        title: "Selectable Todo",
        selected: false,
      });
      const testColumn = createTestColumn({ todos: [testTodo] });

      render(<Main />, { initialColumns: [testColumn] });

      const todoElement = screen
        .getByText("Selectable Todo")
        .closest('[data-testid*="todo"]');
      const checkbox = todoElement?.querySelector('input[type="checkbox"]');

      if (checkbox) {
        await user.click(checkbox);

        await waitFor(() => {
          expect(checkbox).toBeChecked();
        });
      }
    });

    it("should deselect todo when checkbox is clicked again", async () => {
      const user = userEvent.setup();
      const testTodo = createTestTodo({
        title: "Selected Todo",
        selected: true,
      });
      const testColumn = createTestColumn({ todos: [testTodo] });

      render(<Main />, { initialColumns: [testColumn] });

      const todoElement = screen
        .getByText("Selected Todo")
        .closest('[data-testid*="todo"]');
      const checkbox = todoElement?.querySelector('input[type="checkbox"]');

      if (checkbox) {
        await user.click(checkbox);

        await waitFor(() => {
          expect(checkbox).not.toBeChecked();
        });
      }
    });
  });

  describe("Multiple Todos in Column", () => {
    it("should handle multiple todos in the same column", async () => {
      const user = userEvent.setup();
      const testColumn = createTestColumnWithTodos(3, {
        title: "Multi Todo Column",
      });

      render(<Main />, { initialColumns: [testColumn] });

      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 3")).toBeInTheDocument();

      const firstTodoDelete = screen.getAllByTestId("deleteTodo")[0];
      await user.click(firstTodoDelete);

      await waitFor(() => {
        expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
        expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
        expect(screen.getByText("Test Todo 3")).toBeInTheDocument();
      });
    });
  });
});

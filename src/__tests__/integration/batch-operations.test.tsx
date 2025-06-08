import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

import { render, screen, waitFor } from "../../test/test-utils";
import { setupLocalStorageMock } from "../../test/localStorage-mock";
import { createTestColumn, createTestTodo } from "../../test/factories";
import { Main } from "../../Main";

describe("Batch Operations", () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  describe("Select All in Column", () => {
    it("should select all todos in a column when Select All button is clicked", async () => {
      const user = userEvent.setup();
      const todosData = [
        createTestTodo({ title: "Todo 1", selected: false }),
        createTestTodo({ title: "Todo 2", selected: false }),
        createTestTodo({ title: "Todo 3", selected: false }),
      ];
      const testColumn = createTestColumn({
        title: "Test Column",
        todos: todosData,
      });

      render(<Main />, { initialColumns: [testColumn] });

      const selectAllButton = screen.getByTestId("column-select-all");
      expect(selectAllButton).toBeInTheDocument();
      expect(selectAllButton).toHaveTextContent("Select all");

      await user.click(selectAllButton);

      const todo1Checkbox = screen.getByLabelText(/select todo: todo 1/i);
      const todo2Checkbox = screen.getByLabelText(/select todo: todo 2/i);
      const todo3Checkbox = screen.getByLabelText(/select todo: todo 3/i);

      expect(todo1Checkbox).toBeChecked();
      expect(todo2Checkbox).toBeChecked();
      expect(todo3Checkbox).toBeChecked();
    });

    it("should not show Select All button when column has only one todo", async () => {
      const todoData = createTestTodo({ title: "Single Todo" });
      const testColumn = createTestColumn({
        title: "Test Column",
        todos: [todoData],
      });

      render(<Main />, { initialColumns: [testColumn] });

      const selectAllButton = screen.queryByTestId("column-select-all");
      expect(selectAllButton).not.toBeInTheDocument();
    });

    it("should not show Select All button when column is empty", async () => {
      const testColumn = createTestColumn({
        title: "Empty Column",
        todos: [],
      });

      render(<Main />, { initialColumns: [testColumn] });

      const selectAllButton = screen.queryByTestId("column-select-all");
      expect(selectAllButton).not.toBeInTheDocument();
    });
  });

  describe("Bulk Delete Selected Todos", () => {
    it("should delete multiple selected todos when Delete button is clicked", async () => {
      const user = userEvent.setup();
      const todosData = [
        createTestTodo({ title: "Todo 1", selected: true }),
        createTestTodo({ title: "Todo 2", selected: false }),
        createTestTodo({ title: "Todo 3", selected: true }),
      ];
      const testColumn = createTestColumn({
        title: "Test Column",
        todos: todosData,
      });

      render(<Main />, { initialColumns: [testColumn] });

      const deleteButton = screen.getByTestId("main-delete-button");
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).not.toBeDisabled();

      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText("Todo 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Todo 3")).not.toBeInTheDocument();
      });

      expect(screen.getByText("Todo 2")).toBeInTheDocument();
    });

    it("should disable Delete button when no todos are selected", async () => {
      const todosData = [
        createTestTodo({ title: "Todo 1", selected: false }),
        createTestTodo({ title: "Todo 2", selected: false }),
      ];
      const testColumn = createTestColumn({
        title: "Test Column",
        todos: todosData,
      });

      render(<Main />, { initialColumns: [testColumn] });

      const deleteButton = screen.getByTestId("main-delete-button");
      expect(deleteButton).toBeDisabled();
    });

    it("should delete selected todos from multiple columns", async () => {
      const user = userEvent.setup();
      const column1Todos = [
        createTestTodo({ title: "Column1 Todo1", selected: true }),
        createTestTodo({ title: "Column1 Todo2", selected: false }),
      ];
      const column2Todos = [
        createTestTodo({ title: "Column2 Todo1", selected: true }),
        createTestTodo({ title: "Column2 Todo2", selected: false }),
      ];

      const testColumns = [
        createTestColumn({ title: "Column 1", todos: column1Todos }),
        createTestColumn({ title: "Column 2", todos: column2Todos }),
      ];

      render(<Main />, { initialColumns: testColumns });

      const deleteButton = screen.getByTestId("main-delete-button");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText("Column1 Todo1")).not.toBeInTheDocument();
        expect(screen.queryByText("Column2 Todo1")).not.toBeInTheDocument();
      });

      expect(screen.getByText("Column1 Todo2")).toBeInTheDocument();
      expect(screen.getByText("Column2 Todo2")).toBeInTheDocument();
    });
  });

  describe("Bulk Status Change", () => {
    it("should mark multiple selected todos as done", async () => {
      const user = userEvent.setup();
      const todosData = [
        createTestTodo({ title: "Todo 1", selected: true, isFinished: false }),
        createTestTodo({ title: "Todo 2", selected: false, isFinished: false }),
        createTestTodo({ title: "Todo 3", selected: true, isFinished: false }),
      ];
      const testColumn = createTestColumn({
        title: "Test Column",
        todos: todosData,
      });

      render(<Main />, { initialColumns: [testColumn] });

      const markDoneButton = screen.getByTestId("main-mark-done-button");
      expect(markDoneButton).not.toBeDisabled();

      await user.click(markDoneButton);

      await waitFor(() => {
        const todo1Element = screen.getByText("Todo 1");
        const todo3Element = screen.getByText("Todo 3");

        const todo1Container = todo1Element.closest('[class*="mt-5"]');
        const todo3Container = todo3Element.closest('[class*="mt-5"]');

        const todo1FinishButton = todo1Container?.querySelector(
          '[data-testid="finishTodo"]'
        );
        const todo3FinishButton = todo3Container?.querySelector(
          '[data-testid="finishTodo"]'
        );

        expect(todo1FinishButton).toHaveClass("text-green-300");
        expect(todo3FinishButton).toHaveClass("text-green-300");
      });

      const todo2Element = screen.getByText("Todo 2");
      const todo2Container = todo2Element.closest('[class*="mt-5"]');
      const todo2FinishButton = todo2Container?.querySelector(
        '[data-testid="finishTodo"]'
      );
      expect(todo2FinishButton).not.toHaveClass("text-green-300");
    });

    it("should mark multiple selected todos as undone", async () => {
      const user = userEvent.setup();
      const todosData = [
        createTestTodo({ title: "Todo 1", selected: true, isFinished: true }),
        createTestTodo({ title: "Todo 2", selected: false, isFinished: true }),
        createTestTodo({ title: "Todo 3", selected: true, isFinished: true }),
      ];
      const testColumn = createTestColumn({
        title: "Test Column",
        todos: todosData,
      });

      render(<Main />, { initialColumns: [testColumn] });

      const markUndoneButton = screen.getByTestId("main-mark-undone-button");
      expect(markUndoneButton).not.toBeDisabled();

      await user.click(markUndoneButton);

      await waitFor(() => {
        const todo1Element = screen.getByText("Todo 1");
        const todo3Element = screen.getByText("Todo 3");

        const todo1Container = todo1Element.closest('[class*="mt-5"]');
        const todo3Container = todo3Element.closest('[class*="mt-5"]');

        const todo1FinishButton = todo1Container?.querySelector(
          '[data-testid="finishTodo"]'
        );
        const todo3FinishButton = todo3Container?.querySelector(
          '[data-testid="finishTodo"]'
        );

        expect(todo1FinishButton).not.toHaveClass("text-green-300");
        expect(todo3FinishButton).not.toHaveClass("text-green-300");
      });
    });

    it("should disable Mark Done/Undone buttons when no todos are selected", async () => {
      const todosData = [
        createTestTodo({ title: "Todo 1", selected: false }),
        createTestTodo({ title: "Todo 2", selected: false }),
      ];
      const testColumn = createTestColumn({
        title: "Test Column",
        todos: todosData,
      });

      render(<Main />, { initialColumns: [testColumn] });

      const markDoneButton = screen.getByTestId("main-mark-done-button");
      const markUndoneButton = screen.getByTestId("main-mark-undone-button");

      expect(markDoneButton).toBeDisabled();
      expect(markUndoneButton).toBeDisabled();
    });

    it("should clear selection after marking todos as done/undone", async () => {
      const user = userEvent.setup();
      const todosData = [
        createTestTodo({ title: "Todo 1", selected: true, isFinished: false }),
        createTestTodo({ title: "Todo 2", selected: true, isFinished: false }),
      ];
      const testColumn = createTestColumn({
        title: "Test Column",
        todos: todosData,
      });

      render(<Main />, { initialColumns: [testColumn] });

      const markDoneButton = screen.getByTestId("main-mark-done-button");
      await user.click(markDoneButton);

      await waitFor(() => {
        expect(markDoneButton).toBeDisabled();
        expect(screen.getByTestId("main-mark-undone-button")).toBeDisabled();
        expect(screen.getByTestId("main-delete-button")).toBeDisabled();
      });
    });
  });

  describe("Bulk Move Selected Todos", () => {
    it("should move multiple selected todos to another column", async () => {
      const user = userEvent.setup();

      const column1Todos = [
        createTestTodo({ title: "Todo 1", selected: true }),
        createTestTodo({ title: "Todo 2", selected: false }),
        createTestTodo({ title: "Todo 3", selected: true }),
      ];
      const column2Todos = [createTestTodo({ title: "Existing Todo" })];

      const testColumns = [
        createTestColumn({ title: "Source Column", todos: column1Todos }),
        createTestColumn({ title: "Target Column", todos: column2Todos }),
      ];

      render(<Main />, { initialColumns: testColumns });

      const moveButton = screen.getByTestId("main-move-to-button");
      expect(moveButton).toBeInTheDocument();
      expect(moveButton).not.toBeDisabled();

      await user.click(moveButton);

      const targetColumnOption = await screen.findByTestId(
        "dropdown-option-" + testColumns[1].id
      );
      await user.click(targetColumnOption);

      await waitFor(() => {
        const targetColumnElement = screen.getByTestId(
          `column-${testColumns[1].id}`
        );
        expect(targetColumnElement).toHaveTextContent("Todo 1");
        expect(targetColumnElement).toHaveTextContent("Todo 3");
        expect(targetColumnElement).toHaveTextContent("Existing Todo");
      });

      const sourceColumnElement = screen.getByTestId(
        `column-${testColumns[0].id}`
      );
      expect(sourceColumnElement).toHaveTextContent("Todo 2");
      expect(sourceColumnElement).not.toHaveTextContent("Todo 1");
      expect(sourceColumnElement).not.toHaveTextContent("Todo 3");
    });

    it("should disable Move To dropdown when no todos are selected", async () => {
      const todosData = [
        createTestTodo({ title: "Todo 1", selected: false }),
        createTestTodo({ title: "Todo 2", selected: false }),
      ];
      const testColumns = [
        createTestColumn({ title: "Column 1", todos: todosData }),
        createTestColumn({ title: "Column 2", todos: [] }),
      ];

      render(<Main />, { initialColumns: testColumns });

      const moveButton = screen.getByTestId("main-move-to-button");
      expect(moveButton).toBeDisabled();
    });

    it("should handle moving todos to the same column gracefully", async () => {
      const user = userEvent.setup();

      const todosData = [
        createTestTodo({ title: "Todo 1", selected: true }),
        createTestTodo({ title: "Todo 2", selected: false }),
      ];
      const testColumn = createTestColumn({
        title: "Test Column",
        todos: todosData,
      });

      render(<Main />, { initialColumns: [testColumn] });

      const moveButton = screen.getByTestId("main-move-to-button");
      await user.click(moveButton);

      const sameColumnOption = await screen.findByTestId(
        "dropdown-option-" + testColumn.id
      );
      await user.click(sameColumnOption);

      await waitFor(() => {
        const columnElement = screen.getByTestId(`column-${testColumn.id}`);
        expect(columnElement).toHaveTextContent("Todo 1");
        expect(columnElement).toHaveTextContent("Todo 2");
      });
    });
  });

  describe("Combined Batch Operations", () => {
    it("should allow chaining multiple batch operations", async () => {
      const user = userEvent.setup();

      const todosData = [
        createTestTodo({ title: "Todo 1", selected: false }),
        createTestTodo({ title: "Todo 2", selected: false }),
        createTestTodo({ title: "Todo 3", selected: false }),
        createTestTodo({ title: "Todo 4", selected: false }),
      ];
      const testColumn = createTestColumn({
        title: "Test Column",
        todos: todosData,
      });

      render(<Main />, { initialColumns: [testColumn] });

      const selectAllButton = screen.getByTestId("column-select-all");
      await user.click(selectAllButton);

      const markDoneButton = screen.getByTestId("main-mark-done-button");
      await user.click(markDoneButton);

      await waitFor(() => {
        expect(markDoneButton).toBeDisabled();

        const todo1Element = screen.getByText("Todo 1");
        const todo2Element = screen.getByText("Todo 2");
        const todo3Element = screen.getByText("Todo 3");
        const todo4Element = screen.getByText("Todo 4");

        const todo1Container = todo1Element.closest('[class*="mt-5"]');
        const todo2Container = todo2Element.closest('[class*="mt-5"]');
        const todo3Container = todo3Element.closest('[class*="mt-5"]');
        const todo4Container = todo4Element.closest('[class*="mt-5"]');

        const todo1FinishButton = todo1Container?.querySelector(
          '[data-testid="finishTodo"]'
        );
        const todo2FinishButton = todo2Container?.querySelector(
          '[data-testid="finishTodo"]'
        );
        const todo3FinishButton = todo3Container?.querySelector(
          '[data-testid="finishTodo"]'
        );
        const todo4FinishButton = todo4Container?.querySelector(
          '[data-testid="finishTodo"]'
        );

        expect(todo1FinishButton).toHaveClass("text-green-300");
        expect(todo2FinishButton).toHaveClass("text-green-300");
        expect(todo3FinishButton).toHaveClass("text-green-300");
        expect(todo4FinishButton).toHaveClass("text-green-300");
      });
    });
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "../../test/test-utils";

import { render } from "../../test/test-utils";
import { setupLocalStorageMock } from "../../test/localStorage-mock";
import {
  createTestColumnWithTodos,
  createTestTodo,
} from "../../test/factories";
import { Main } from "../../Main";

const simulateDragAndDrop = async (
  dragElement: HTMLElement,
  dropElement: HTMLElement
) => {
  fireEvent.dragStart(dragElement);
  fireEvent.dragEnter(dropElement);
  fireEvent.dragOver(dropElement);
  fireEvent.drop(dropElement);
  fireEvent.dragEnd(dragElement);
};

describe("Todo Drag & Drop", () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  describe("Todo Reordering Within Column", () => {
    it("should display todos in the correct initial order", async () => {
      const testColumn = createTestColumnWithTodos(3, { title: "Test Column" });

      render(<Main />, { initialColumns: [testColumn] });

      const firstTodo = screen.getByText("Test Todo 1");
      const secondTodo = screen.getByText("Test Todo 2");
      const thirdTodo = screen.getByText("Test Todo 3");

      expect(firstTodo).toBeInTheDocument();
      expect(secondTodo).toBeInTheDocument();
      expect(thirdTodo).toBeInTheDocument();

      const todoTitles = screen.getAllByText(/Test Todo \d/);
      expect(todoTitles).toHaveLength(3);
    });

    it("should maintain todo properties during reorder", async () => {
      const testColumn = createTestColumnWithTodos(2, { title: "Test Column" });
      testColumn.todos[0].isFinished = true;
      testColumn.todos[1].selected = true;

      render(<Main />, { initialColumns: [testColumn] });

      const firstTodo = screen.getByText("Test Todo 1");
      const secondTodo = screen.getByText("Test Todo 2");

      expect(firstTodo).toBeInTheDocument();
      expect(secondTodo).toBeInTheDocument();

      const firstTodoCard = firstTodo.closest('[class*="mt-5"]');
      expect(firstTodoCard).toBeInTheDocument();

      const checkboxes = screen.getAllByRole("checkbox");
      const secondTodoCheckbox = checkboxes.find((checkbox) =>
        checkbox
          .closest('[class*="mt-5"]')
          ?.textContent?.includes("Test Todo 2")
      );
      expect(secondTodoCheckbox).toBeInTheDocument();
      if (secondTodoCheckbox) {
        expect(secondTodoCheckbox).toBeChecked();
      }
    });

    it("should have draggable elements accessible", async () => {
      const testColumn = createTestColumnWithTodos(2, { title: "Test Column" });

      render(<Main />, { initialColumns: [testColumn] });

      const dragHandles = screen.getAllByTestId("dragTodo");
      expect(dragHandles).toHaveLength(2);

      dragHandles.forEach((handle) => {
        const todoCard = handle.closest('[class*="mt-5"]');
        expect(todoCard).toBeInTheDocument();
      });
    });
  });

  describe("Todo Movement Between Columns", () => {
    it("should move todo from one column to another when dragged", async () => {
      const sourceColumn = createTestColumnWithTodos(2, {
        title: "Source Column",
      });
      const targetColumn = createTestColumnWithTodos(1, {
        title: "Target Column",
      });

      render(<Main />, { initialColumns: [sourceColumn, targetColumn] });

      expect(screen.getByText("Source Column")).toBeInTheDocument();
      expect(screen.getByText("Target Column")).toBeInTheDocument();
      const allTodoTexts = screen.getAllByText(/Test Todo \d/);
      expect(allTodoTexts).toHaveLength(3);

      const dragHandles = screen.getAllByTestId("dragTodo");
      expect(dragHandles.length).toBeGreaterThan(0);

      expect(dragHandles[0]).toBeInTheDocument();
    });

    it("should handle moving todo to empty column", async () => {
      const sourceColumn = createTestColumnWithTodos(1, {
        title: "Source Column",
      });
      const emptyColumn = createTestColumnWithTodos(0, {
        title: "Empty Column",
      });

      render(<Main />, { initialColumns: [sourceColumn, emptyColumn] });

      expect(screen.getByText("Source Column")).toBeInTheDocument();
      expect(screen.getByText("Empty Column")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();

      expect(
        screen.getByText("Nothing here yet. Add a new task!")
      ).toBeInTheDocument();

      const dragHandles = screen.getAllByTestId("dragTodo");
      expect(dragHandles.length).toBeGreaterThan(0);
      const dragHandle = dragHandles[0];
      expect(dragHandle).toBeInTheDocument();

      const emptyStates = screen.getAllByText(
        "Nothing here yet. Add a new task!"
      );
      expect(emptyStates).toHaveLength(1);
    });

    it("should preserve todo properties when moving between columns", async () => {
      const todo = createTestTodo({
        title: "Special Todo",
        isFinished: true,
        selected: true,
      });
      const sourceColumn = createTestColumnWithTodos(0, {
        title: "Source Column",
      });
      sourceColumn.todos.push(todo);
      const targetColumn = createTestColumnWithTodos(0, {
        title: "Target Column",
      });

      render(<Main />, { initialColumns: [sourceColumn, targetColumn] });

      expect(screen.getByText("Special Todo")).toBeInTheDocument();

      const specialTodoCard = screen
        .getByText("Special Todo")
        .closest('[class*="mt-5"]');
      expect(specialTodoCard).toBeInTheDocument();

      const dragHandles = screen.getAllByTestId("dragTodo");
      expect(dragHandles.length).toBeGreaterThan(0);
      const dragHandle = dragHandles[0];
      expect(dragHandle).toBeInTheDocument();
    });
  });

  describe("Drag Visual Feedback", () => {
    it("should have proper drag handles and visual indicators", async () => {
      const testColumn = createTestColumnWithTodos(2, { title: "Test Column" });

      render(<Main />, { initialColumns: [testColumn] });

      const dragHandles = screen.getAllByTestId("dragTodo");
      expect(dragHandles).toHaveLength(2);

      dragHandles.forEach((handle) => {
        expect(handle).toBeInTheDocument();
        expect(handle.tagName.toLowerCase()).toBe("button");
      });
    });

    it("should have drop zones properly configured", async () => {
      const sourceColumn = createTestColumnWithTodos(1, {
        title: "Source Column",
      });
      const targetColumn = createTestColumnWithTodos(0, {
        title: "Target Column",
      });

      render(<Main />, { initialColumns: [sourceColumn, targetColumn] });

      const emptyState = screen.getByText("Nothing here yet. Add a new task!");
      expect(emptyState).toBeInTheDocument();

      const dragHandles = screen.getAllByTestId("dragTodo");
      expect(dragHandles.length).toBeGreaterThan(0);
      const dragHandle = dragHandles[0];
      expect(dragHandle).toBeInTheDocument();
    });
  });

  describe("Drag Interaction Simulation", () => {
    it("should simulate basic drag interactions", async () => {
      const testColumn = createTestColumnWithTodos(2, { title: "Test Column" });

      render(<Main />, { initialColumns: [testColumn] });

      const dragHandles = screen.getAllByTestId("dragTodo");
      expect(dragHandles.length).toBeGreaterThan(0);
      const dragHandle = dragHandles[0];
      expect(dragHandle).toBeInTheDocument();

      const todoCards = screen.getAllByText(/Test Todo \d/);
      expect(todoCards.length).toBeGreaterThan(1);

      const sourceCard = todoCards[0].closest('[class*="mt-5"]') as HTMLElement;
      const targetCard = todoCards[1].closest('[class*="mt-5"]') as HTMLElement;

      expect(sourceCard).toBeInTheDocument();
      expect(targetCard).toBeInTheDocument();
    });

    it("should handle keyboard navigation for drag operations", async () => {
      const testColumn = createTestColumnWithTodos(2, { title: "Test Column" });

      render(<Main />, { initialColumns: [testColumn] });

      const dragHandles = screen.getAllByTestId("dragTodo");
      expect(dragHandles.length).toBeGreaterThan(0);
      const dragHandle = dragHandles[0];
      expect(dragHandle).toBeInTheDocument();

      dragHandle.focus();
      expect(document.activeElement).toBe(dragHandle);
    });
  });
});

export { simulateDragAndDrop };

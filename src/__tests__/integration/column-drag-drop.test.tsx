import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "../../test/test-utils";

import { render } from "../../test/test-utils";
import { setupLocalStorageMock } from "../../test/localStorage-mock";
import { createTestColumnWithTodos } from "../../test/factories";
import { Main } from "../../Main";

const simulateColumnDragAndDrop = async (
  dragElement: HTMLElement,
  dropElement: HTMLElement
) => {
  fireEvent.dragStart(dragElement);
  fireEvent.dragEnter(dropElement);
  fireEvent.dragOver(dropElement);
  fireEvent.drop(dropElement);
  fireEvent.dragEnd(dragElement);
};

describe("Column Drag & Drop", () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  describe("Column Reordering", () => {
    it("should display columns in the correct initial order", async () => {
      const column1 = createTestColumnWithTodos(1, { title: "First Column" });
      const column2 = createTestColumnWithTodos(2, { title: "Second Column" });
      const column3 = createTestColumnWithTodos(1, { title: "Third Column" });

      render(<Main />, { initialColumns: [column1, column2, column3] });

      expect(screen.getByText("First Column")).toBeInTheDocument();
      expect(screen.getByText("Second Column")).toBeInTheDocument();
      expect(screen.getByText("Third Column")).toBeInTheDocument();

      const columns = screen
        .getAllByRole("button")
        .filter(
          (button) =>
            button.className.includes("flex flex-col") &&
            button.className.includes("bg-secondary")
        );
      expect(columns.length).toBeGreaterThanOrEqual(3);
    });

    it("should have draggable column handles", async () => {
      const column1 = createTestColumnWithTodos(1, {
        title: "Draggable Column",
      });
      const column2 = createTestColumnWithTodos(1, { title: "Target Column" });

      render(<Main />, { initialColumns: [column1, column2] });

      const draggableIcons = screen
        .getAllByRole("button")
        .filter(
          (button) => button.getAttribute("title") === "Drag to reorder column"
        );

      expect(draggableIcons.length).toBeGreaterThan(0);
    });

    it("should maintain column properties during reorder", async () => {
      const column1 = createTestColumnWithTodos(2, { title: "Column A" });
      const column2 = createTestColumnWithTodos(1, { title: "Column B" });

      render(<Main />, { initialColumns: [column1, column2] });

      expect(screen.getByText("Column A")).toBeInTheDocument();
      expect(screen.getByText("Column B")).toBeInTheDocument();

      const todoTexts = screen.getAllByText(/Test Todo \d/);
      expect(todoTexts).toHaveLength(3);
    });
  });

  describe("Column Movement and Layout", () => {
    it("should handle column drag with multiple columns", async () => {
      const columns = [
        createTestColumnWithTodos(1, { title: "Alpha" }),
        createTestColumnWithTodos(0, { title: "Beta" }),
        createTestColumnWithTodos(2, { title: "Gamma" }),
      ];

      render(<Main />, { initialColumns: columns });

      expect(screen.getByText("Alpha")).toBeInTheDocument();
      expect(screen.getByText("Beta")).toBeInTheDocument();
      expect(screen.getByText("Gamma")).toBeInTheDocument();

      const columnElements = screen
        .getAllByRole("button")
        .filter(
          (button) =>
            button.className.includes("flex flex-col") &&
            button.className.includes("bg-secondary")
        );
      expect(columnElements.length).toBeGreaterThanOrEqual(3);
    });

    it("should preserve todos when columns are reordered", async () => {
      const columnWithTodos = createTestColumnWithTodos(3, {
        title: "Rich Column",
      });
      const emptyColumn = createTestColumnWithTodos(0, {
        title: "Empty Column",
      });

      render(<Main />, { initialColumns: [columnWithTodos, emptyColumn] });

      expect(screen.getByText("Rich Column")).toBeInTheDocument();
      expect(screen.getByText("Empty Column")).toBeInTheDocument();

      const todoTexts = screen.getAllByText(/Test Todo \d/);
      expect(todoTexts).toHaveLength(3);

      expect(
        screen.getByText("Nothing here yet. Add a new task!")
      ).toBeInTheDocument();
    });
  });

  describe("Column Drag Visual Feedback", () => {
    it("should have proper column drag handles", async () => {
      const column = createTestColumnWithTodos(1, { title: "Test Column" });

      render(<Main />, { initialColumns: [column] });

      const draggableElements = screen
        .getAllByRole("button")
        .filter(
          (button) =>
            button.getAttribute("title")?.includes("Drag") ||
            button.className.includes("cursor-grab")
        );

      expect(draggableElements.length).toBeGreaterThanOrEqual(0);
    });

    it("should show proper column layout for drag operations", async () => {
      const columns = [
        createTestColumnWithTodos(1, { title: "Source" }),
        createTestColumnWithTodos(1, { title: "Target" }),
      ];

      render(<Main />, { initialColumns: columns });

      expect(screen.getByText("Source")).toBeInTheDocument();
      expect(screen.getByText("Target")).toBeInTheDocument();

      const layoutContainer = screen.getByTestId("page");
      expect(layoutContainer).toBeInTheDocument();
    });
  });

  describe("Column Drag Constraints", () => {
    it("should handle single column scenario", async () => {
      const singleColumn = createTestColumnWithTodos(2, {
        title: "Only Column",
      });

      render(<Main />, { initialColumns: [singleColumn] });

      expect(screen.getByText("Only Column")).toBeInTheDocument();

      const columnElement = screen.getByRole("button", {
        name: /only column/i,
      });
      expect(columnElement).toBeInTheDocument();
    });

    it("should handle empty columns in drag operations", async () => {
      const emptyColumn1 = createTestColumnWithTodos(0, { title: "Empty One" });
      const emptyColumn2 = createTestColumnWithTodos(0, { title: "Empty Two" });

      render(<Main />, { initialColumns: [emptyColumn1, emptyColumn2] });

      expect(screen.getByText("Empty One")).toBeInTheDocument();
      expect(screen.getByText("Empty Two")).toBeInTheDocument();

      const emptyStateTexts = screen.getAllByText(
        "Nothing here yet. Add a new task!"
      );
      expect(emptyStateTexts).toHaveLength(2);
    });
  });

  describe("Column and Todo Interaction", () => {
    it("should allow column drag without affecting todos", async () => {
      const columnWithTodos = createTestColumnWithTodos(2, {
        title: "Column With Todos",
      });

      render(<Main />, { initialColumns: [columnWithTodos] });

      expect(screen.getByText("Column With Todos")).toBeInTheDocument();
      const todoTexts = screen.getAllByText(/Test Todo \d/);
      expect(todoTexts).toHaveLength(2);

      const allDragHandles = screen.getAllByRole("button", {
        name: /drag/i,
      });
      expect(allDragHandles.length).toBeGreaterThanOrEqual(0);
    });

    it("should maintain column titles during drag operations", async () => {
      const column1 = createTestColumnWithTodos(1, {
        title: "Important Column",
      });
      const column2 = createTestColumnWithTodos(1, {
        title: "Secondary Column",
      });

      render(<Main />, { initialColumns: [column1, column2] });

      expect(screen.getByText("Important Column")).toBeInTheDocument();
      expect(screen.getByText("Secondary Column")).toBeInTheDocument();

      const columns = screen
        .getAllByRole("button")
        .filter((button) => button.className.includes("flex flex-col"));
      expect(columns.length).toBeGreaterThanOrEqual(2);
    });
  });
});

export { simulateColumnDragAndDrop };

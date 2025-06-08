import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

import { render, screen, waitFor } from "../../test/test-utils";
import { setupLocalStorageMock } from "../../test/localStorage-mock";
import {
  createTestColumn,
  createTestColumnWithTodos,
} from "../../test/factories";
import { Main } from "../../Main";

describe("Column Management", () => {
  beforeEach(() => {
    setupLocalStorageMock();
  });

  describe("Column Creation", () => {
    it("should create a new column when Create Column button is clicked", async () => {
      const user = userEvent.setup();

      render(<Main />, { initialColumns: [] });

      const createColumnButton = screen.getByRole("button", {
        name: /need a column.*click here to create one/i,
      });
      await user.click(createColumnButton);

      const newColumn = await screen.findByDisplayValue("New Column");
      expect(newColumn).toBeInTheDocument();
    });

    it("should add column with editable title in new state", async () => {
      const user = userEvent.setup();

      render(<Main />, { initialColumns: [] });

      const createColumnButton = screen.getByRole("button", {
        name: /need a column.*click here to create one/i,
      });
      await user.click(createColumnButton);

      const titleInput = await screen.findByDisplayValue("New Column");
      expect(titleInput).toHaveAttribute("type", "text");
    });

    it("should create multiple columns", async () => {
      const user = userEvent.setup();

      render(<Main />, { initialColumns: [] });

      const createColumnButton = screen.getByRole("button", {
        name: /need a column.*click here to create one/i,
      });

      await user.click(createColumnButton);
      const firstColumn = await screen.findByDisplayValue("New Column");
      await user.clear(firstColumn);
      await user.type(firstColumn, "First Column");
      await user.keyboard("{Enter}");

      await user.click(createColumnButton);
      const secondColumnInput = await screen.findByDisplayValue("New Column");
      await user.clear(secondColumnInput);
      await user.type(secondColumnInput, "Second Column");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText("First Column")).toBeInTheDocument();
        expect(screen.getByText("Second Column")).toBeInTheDocument();
      });
    });
  });

  describe("Column Title Editing", () => {
    it("should allow editing column title by clicking on it", async () => {
      const user = userEvent.setup();
      const testColumn = createTestColumn({ title: "Original Column Title" });

      render(<Main />, { initialColumns: [testColumn] });

      const columnTitle = screen.getByText("Original Column Title");
      await user.click(columnTitle);

      const titleInput = await screen.findByDisplayValue(
        "Original Column Title"
      );
      expect(titleInput).toBeInTheDocument();
    });

    it("should save new column title when Enter is pressed", async () => {
      const user = userEvent.setup();
      const testColumn = createTestColumn({ title: "Original Column Title" });

      render(<Main />, { initialColumns: [testColumn] });

      const columnTitle = screen.getByText("Original Column Title");
      await user.click(columnTitle);

      const titleInput = await screen.findByDisplayValue(
        "Original Column Title"
      );
      await user.clear(titleInput);
      await user.type(titleInput, "Updated Column Title");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText("Updated Column Title")).toBeInTheDocument();
      });
    });

    it("should save title when input loses focus", async () => {
      const user = userEvent.setup();
      const testColumn = createTestColumn({ title: "Original Column Title" });

      render(<Main />, { initialColumns: [testColumn] });

      const columnTitle = screen.getByText("Original Column Title");
      await user.click(columnTitle);

      const titleInput = await screen.findByDisplayValue(
        "Original Column Title"
      );
      await user.clear(titleInput);
      await user.type(titleInput, "Blur Updated Title");

      const mainArea = screen.getByTestId("page");
      await user.click(mainArea);

      await waitFor(() => {
        expect(screen.getByText("Blur Updated Title")).toBeInTheDocument();
      });
    });

    it("should handle very long column titles", async () => {
      const user = userEvent.setup();
      const testColumn = createTestColumn({ title: "Short Title" });

      render(<Main />, { initialColumns: [testColumn] });

      const columnTitle = screen.getByText("Short Title");
      await user.click(columnTitle);

      const titleInput = await screen.findByDisplayValue("Short Title");
      const longTitle =
        "This is a very long column title that should be handled gracefully by the application";
      await user.clear(titleInput);
      await user.type(titleInput, longTitle);
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText(longTitle)).toBeInTheDocument();
      });
    });

    it("should handle special characters in column titles", async () => {
      const user = userEvent.setup();
      const testColumn = createTestColumn({ title: "Normal Title" });

      render(<Main />, { initialColumns: [testColumn] });

      const columnTitle = screen.getByText("Normal Title");
      await user.click(columnTitle);

      const titleInput = await screen.findByDisplayValue("Normal Title");
      const specialTitle = "Title with 🎯 émojis & spéciâl chârs!";
      await user.clear(titleInput);
      await user.type(titleInput, specialTitle);
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText(specialTitle)).toBeInTheDocument();
      });
    });
  });

  describe("Column Deletion", () => {
    it("should delete empty column when delete button is clicked", async () => {
      const user = userEvent.setup();
      const testColumn = createTestColumn({ title: "Column to Delete" });

      render(<Main />, { initialColumns: [testColumn] });

      const deleteButton = screen.getByTestId("deleteColumn");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText("Column to Delete")).not.toBeInTheDocument();
      });
    });

    it("should delete column with todos and remove all todos", async () => {
      const user = userEvent.setup();
      const testColumn = createTestColumnWithTodos(3, {
        title: "Column with Todos",
      });

      render(<Main />, { initialColumns: [testColumn] });

      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 3")).toBeInTheDocument();

      const deleteButton = screen.getByTestId("deleteColumn");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText("Column with Todos")).not.toBeInTheDocument();
        expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Test Todo 2")).not.toBeInTheDocument();
        expect(screen.queryByText("Test Todo 3")).not.toBeInTheDocument();
      });
    });

    it("should handle deleting one column among multiple", async () => {
      const user = userEvent.setup();
      const column1 = createTestColumn({ title: "Column 1" });
      const column2 = createTestColumn({ title: "Column to Delete" });
      const column3 = createTestColumn({ title: "Column 3" });

      render(<Main />, { initialColumns: [column1, column2, column3] });

      expect(screen.getByText("Column 1")).toBeInTheDocument();
      expect(screen.getByText("Column to Delete")).toBeInTheDocument();
      expect(screen.getByText("Column 3")).toBeInTheDocument();

      const deleteButtons = screen.getAllByTestId("deleteColumn");
      await user.click(deleteButtons[1]);

      await waitFor(() => {
        expect(screen.getByText("Column 1")).toBeInTheDocument();
        expect(screen.queryByText("Column to Delete")).not.toBeInTheDocument();
        expect(screen.getByText("Column 3")).toBeInTheDocument();
      });
    });
  });

  describe("Column with Todos Integration", () => {
    it("should show correct todo count in column", async () => {
      const testColumn = createTestColumnWithTodos(5, {
        title: "Column with 5 Todos",
      });

      render(<Main />, { initialColumns: [testColumn] });

      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 3")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 4")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 5")).toBeInTheDocument();
    });

    it("should allow adding todos to existing column", async () => {
      const user = userEvent.setup();
      const testColumn = createTestColumn({ title: "Empty Column" });

      render(<Main />, { initialColumns: [testColumn] });

      expect(screen.getByText("Empty Column")).toBeInTheDocument();

      const addTodoButtons = screen.getAllByRole("button", {
        name: /add todo/i,
      });

      const specificAddTodoButton = addTodoButtons.find(
        (btn) => btn.textContent?.trim() === "Add todo"
      );
      expect(specificAddTodoButton).toBeDefined();

      await user.click(specificAddTodoButton!);

      await waitFor(() => {
        const newTodoInput = screen.getByDisplayValue("New Todo");
        expect(newTodoInput).toBeInTheDocument();
        expect(newTodoInput).toHaveAttribute("type", "text");
      });
    });

    it("should maintain column structure when todos are modified", async () => {
      const user = userEvent.setup();
      const testColumn = createTestColumnWithTodos(2, {
        title: "Stable Column",
      });

      render(<Main />, { initialColumns: [testColumn] });

      const deleteButtons = screen.getAllByTestId("deleteTodo");
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Stable Column")).toBeInTheDocument();
        expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
        expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
      });
    });
  });

  describe("Empty State", () => {
    it("should show empty state when no columns exist", () => {
      render(<Main />, { initialColumns: [] });

      const createColumnButton = screen.getByRole("button", {
        name: /need a column.*click here to create one/i,
      });
      expect(createColumnButton).toBeInTheDocument();
    });

    it("should show empty column state when column has no todos", () => {
      const emptyColumn = createTestColumn({
        title: "Empty Column",
        todos: [],
      });

      render(<Main />, { initialColumns: [emptyColumn] });

      expect(screen.getByText("Empty Column")).toBeInTheDocument();
      const addTodoButtons = screen.getAllByRole("button", {
        name: /add todo/i,
      });
      expect(addTodoButtons[0]).toBeInTheDocument();
    });
  });
});

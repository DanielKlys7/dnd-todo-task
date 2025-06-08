import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createTodoWithTitle,
  createColumnWithTodos,
} from "../../test/factories";
import { renderWithProviders } from "../../test/test-utils";
import { Main } from "../../Main/index";

describe("Search and Filter Functionality", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Search Functionality", () => {
    it("should filter todos based on search input", async () => {
      const user = userEvent.setup();

      const mockColumns = [
        createColumnWithTodos("Todo", [
          createTodoWithTitle("Buy groceries"),
          createTodoWithTitle("Walk the dog"),
          createTodoWithTitle("Write documentation"),
        ]),
        createColumnWithTodos("In Progress", [
          createTodoWithTitle("Review code"),
          createTodoWithTitle("Buy coffee"),
        ]),
      ];

      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search todos");
      expect(searchInput).toBeInTheDocument();

      await user.type(searchInput, "buy");

      await waitFor(
        () => {
          const highlightedElements = screen.getAllByTestId("highlighted-text");
          const originalTexts = highlightedElements.map((el) =>
            el.getAttribute("data-original-text")
          );

          expect(originalTexts).toContain("Buy groceries");
          expect(originalTexts).toContain("Buy coffee");

          expect(originalTexts).not.toContain("Walk the dog");
          expect(originalTexts).not.toContain("Write documentation");
          expect(originalTexts).not.toContain("Review code");

          expect(highlightedElements).toHaveLength(2);
        },
        { timeout: 1000 }
      );
    });

    it("should be case-insensitive", async () => {
      const user = userEvent.setup();

      const mockColumns = [
        createColumnWithTodos("Todo", [
          createTodoWithTitle("JavaScript Tutorial"),
          createTodoWithTitle("python course"),
        ]),
      ];

      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("JavaScript Tutorial")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search todos");

      await user.type(searchInput, "javascript");

      await waitFor(
        () => {
          const highlightedElements = screen.getAllByTestId("highlighted-text");
          const originalTexts = highlightedElements.map((el) =>
            el.getAttribute("data-original-text")
          );

          expect(originalTexts).toContain("JavaScript Tutorial");
          expect(originalTexts).not.toContain("python course");
          expect(highlightedElements).toHaveLength(1);
        },
        { timeout: 1000 }
      );

      await user.clear(searchInput);
      await user.type(searchInput, "PYTHON");

      await waitFor(
        () => {
          const highlightedElements = screen.getAllByTestId("highlighted-text");
          const originalTexts = highlightedElements.map((el) =>
            el.getAttribute("data-original-text")
          );

          expect(originalTexts).toContain("python course");
          expect(originalTexts).not.toContain("JavaScript Tutorial");
          expect(highlightedElements).toHaveLength(1);
        },
        { timeout: 1000 }
      );
    });

    it("should show all todos when search is cleared", async () => {
      const user = userEvent.setup();

      const mockColumns = [
        createColumnWithTodos("Todo", [
          createTodoWithTitle("Buy groceries"),
          createTodoWithTitle("Walk the dog"),
        ]),
      ];

      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
        expect(screen.getByText("Walk the dog")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search todos");

      await user.type(searchInput, "buy");

      await waitFor(
        () => {
          const allHighlightedTexts = screen.getAllByTestId("highlighted-text");
          const originalTexts = allHighlightedTexts.map((el) =>
            el.getAttribute("data-original-text")
          );
          expect(originalTexts).toContain("Buy groceries");
          expect(originalTexts).not.toContain("Walk the dog");
        },
        { timeout: 1000 }
      );

      await user.clear(searchInput);

      await waitFor(
        () => {
          expect(screen.getByText("Buy groceries")).toBeInTheDocument();
          expect(screen.getByText("Walk the dog")).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("should debounce search input to avoid excessive filtering", async () => {
      const user = userEvent.setup();

      const mockColumns = [
        createColumnWithTodos("Todo", [createTodoWithTitle("Test todo")]),
      ];

      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("Test todo")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search todos");

      await user.type(searchInput, "test");

      await waitFor(
        () => {
          const highlightedElements = screen.getAllByTestId("highlighted-text");
          const originalTexts = highlightedElements.map((el) =>
            el.getAttribute("data-original-text")
          );
          expect(originalTexts).toContain("Test todo");
        },
        { timeout: 1000 }
      );
    });
  });

  describe("Filter by Status", () => {
    const mockColumns = [
      createColumnWithTodos("Todo", [
        { ...createTodoWithTitle("Finished task"), isFinished: true },
        { ...createTodoWithTitle("Unfinished task"), isFinished: false },
        { ...createTodoWithTitle("Another finished"), isFinished: true },
        { ...createTodoWithTitle("Another unfinished"), isFinished: false },
      ]),
    ];

    it("should show all todos by default", async () => {
      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("Finished task")).toBeInTheDocument();
        expect(screen.getByText("Unfinished task")).toBeInTheDocument();
        expect(screen.getByText("Another finished")).toBeInTheDocument();
        expect(screen.getByText("Another unfinished")).toBeInTheDocument();
      });
    });

    it("should filter to show only finished todos", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("Finished task")).toBeInTheDocument();
      });

      const filterSelect = screen.getByDisplayValue("all");
      await user.selectOptions(filterSelect, "finished");

      await waitFor(() => {
        expect(screen.getByText("Finished task")).toBeInTheDocument();
        expect(screen.getByText("Another finished")).toBeInTheDocument();
      });

      expect(screen.queryByText("Unfinished task")).not.toBeInTheDocument();
      expect(screen.queryByText("Another unfinished")).not.toBeInTheDocument();
    });

    it("should filter to show only unfinished todos", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("Finished task")).toBeInTheDocument();
      });

      const filterSelect = screen.getByDisplayValue("all");
      await user.selectOptions(filterSelect, "unfinished");

      await waitFor(() => {
        expect(screen.getByText("Unfinished task")).toBeInTheDocument();
        expect(screen.getByText("Another unfinished")).toBeInTheDocument();
      });

      expect(screen.queryByText("Finished task")).not.toBeInTheDocument();
      expect(screen.queryByText("Another finished")).not.toBeInTheDocument();
    });

    it('should reset to show all todos when "all" is selected', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("Finished task")).toBeInTheDocument();
      });

      const filterSelect = screen.getByDisplayValue("all");
      await user.selectOptions(filterSelect, "finished");

      await waitFor(() => {
        expect(screen.queryByText("Unfinished task")).not.toBeInTheDocument();
      });

      await user.selectOptions(filterSelect, "all");

      await waitFor(() => {
        expect(screen.getByText("Finished task")).toBeInTheDocument();
        expect(screen.getByText("Unfinished task")).toBeInTheDocument();
        expect(screen.getByText("Another finished")).toBeInTheDocument();
        expect(screen.getByText("Another unfinished")).toBeInTheDocument();
      });
    });
  });

  describe("Combined Search and Filter", () => {
    const mockColumns = [
      createColumnWithTodos("Todo", [
        { ...createTodoWithTitle("Buy groceries"), isFinished: true },
        { ...createTodoWithTitle("Buy coffee"), isFinished: false },
        { ...createTodoWithTitle("Walk the dog"), isFinished: true },
        { ...createTodoWithTitle("Walk in park"), isFinished: false },
      ]),
    ];

    it("should apply both search and filter criteria", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search todos");
      await user.type(searchInput, "buy");

      await waitFor(
        () => {
          const allHighlightedTexts = screen.getAllByTestId("highlighted-text");
          const originalTexts = allHighlightedTexts.map((el) =>
            el.getAttribute("data-original-text")
          );
          expect(originalTexts).toContain("Buy groceries");
          expect(originalTexts).toContain("Buy coffee");
        },
        { timeout: 1000 }
      );

      const filterSelect = screen.getByDisplayValue("all");
      await user.selectOptions(filterSelect, "finished");

      await waitFor(() => {
        const allHighlightedTexts = screen.getAllByTestId("highlighted-text");
        const originalTexts = allHighlightedTexts.map((el) =>
          el.getAttribute("data-original-text")
        );
        expect(originalTexts).toContain("Buy groceries");
        expect(originalTexts).not.toContain("Buy coffee");
        expect(originalTexts).not.toContain("Walk the dog");
        expect(originalTexts).not.toContain("Walk in park");
      });
    });

    it("should clear results when no todos match both criteria", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search todos");
      await user.type(searchInput, "groceries");

      await waitFor(
        () => {
          const allHighlightedTexts = screen.getAllByTestId("highlighted-text");
          const originalTexts = allHighlightedTexts.map((el) =>
            el.getAttribute("data-original-text")
          );
          expect(originalTexts).toContain("Buy groceries");
        },
        { timeout: 1000 }
      );

      const filterSelect = screen.getByDisplayValue("all");
      await user.selectOptions(filterSelect, "unfinished");

      await waitFor(() => {
        expect(screen.queryAllByTestId("highlighted-text")).toHaveLength(0);
      });
    });

    it("should update results when filter changes while search is active", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search todos");
      await user.type(searchInput, "walk");

      await waitFor(
        () => {
          const allHighlightedTexts = screen.getAllByTestId("highlighted-text");
          const originalTexts = allHighlightedTexts.map((el) =>
            el.getAttribute("data-original-text")
          );
          expect(originalTexts).toContain("Walk the dog");
          expect(originalTexts).toContain("Walk in park");
        },
        { timeout: 1000 }
      );

      const filterSelect = screen.getByDisplayValue("all");
      await user.selectOptions(filterSelect, "finished");

      await waitFor(() => {
        const allHighlightedTexts = screen.getAllByTestId("highlighted-text");
        const originalTexts = allHighlightedTexts.map((el) =>
          el.getAttribute("data-original-text")
        );
        expect(originalTexts).toContain("Walk the dog");
        expect(originalTexts).not.toContain("Walk in park");
      });

      await user.selectOptions(filterSelect, "unfinished");

      await waitFor(() => {
        const allHighlightedTexts = screen.getAllByTestId("highlighted-text");
        const originalTexts = allHighlightedTexts.map((el) =>
          el.getAttribute("data-original-text")
        );
        expect(originalTexts).toContain("Walk in park");
        expect(originalTexts).not.toContain("Walk the dog");
      });
    });
  });

  describe("Search Highlighting", () => {
    it("should maintain todo functionality while filtered", async () => {
      const user = userEvent.setup();

      const mockColumns = [
        createColumnWithTodos("Todo", [
          createTodoWithTitle("Buy groceries"),
          createTodoWithTitle("Walk the dog"),
        ]),
      ];

      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search todos");
      await user.type(searchInput, "buy");

      await waitFor(
        () => {
          const allHighlightedTexts = screen.getAllByTestId("highlighted-text");
          const originalTexts = allHighlightedTexts.map((el) =>
            el.getAttribute("data-original-text")
          );
          expect(originalTexts).toContain("Buy groceries");
          expect(originalTexts).not.toContain("Walk the dog");
        },
        { timeout: 1000 }
      );

      const finishButton = screen.getByTestId("finishTodo");
      expect(finishButton).toBeInTheDocument();

      await user.click(finishButton);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty search results gracefully", async () => {
      const user = userEvent.setup();

      const mockColumns = [
        createColumnWithTodos("Todo", [createTodoWithTitle("Buy groceries")]),
      ];

      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search todos");
      await user.type(searchInput, "nonexistent");

      await waitFor(
        () => {
          expect(screen.queryAllByTestId("highlighted-text")).toHaveLength(0);
        },
        { timeout: 1000 }
      );

      expect(screen.getByText("Todo")).toBeInTheDocument();
    });

    it("should handle special characters in search", async () => {
      const user = userEvent.setup();

      const mockColumns = [
        createColumnWithTodos("Todo", [
          createTodoWithTitle("Fix bug #123"),
          createTodoWithTitle("Update @mentions"),
          createTodoWithTitle("Review $pricing"),
        ]),
      ];

      renderWithProviders(<Main />, { initialColumns: mockColumns });

      await waitFor(() => {
        expect(screen.getByText("Fix bug #123")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search todos");
      await user.type(searchInput, "#123");

      await waitFor(
        () => {
          const allHighlightedTexts = screen.getAllByTestId("highlighted-text");
          const originalTexts = allHighlightedTexts.map((el) =>
            el.getAttribute("data-original-text")
          );
          expect(originalTexts).toContain("Fix bug #123");
          expect(originalTexts).not.toContain("Update @mentions");
          expect(originalTexts).not.toContain("Review $pricing");
        },
        { timeout: 1000 }
      );
    });
  });
});

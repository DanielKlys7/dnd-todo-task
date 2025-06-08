import { describe, it, expect } from "vitest";
import { screen, render } from "@testing-library/react";
import { renderWithProviders } from "./src/test/test-utils";
import { Main } from "./src/Main/index";
import {
  createColumnWithTodos,
  createTodoWithTitle,
} from "./src/test/factories";

describe("Debug Test", () => {
  it("should render Main component", async () => {
    const mockColumns = [
      createColumnWithTodos("Todo", [createTodoWithTitle("Test todo")]),
    ];

    renderWithProviders(<Main />, { initialColumns: mockColumns });

    // Debug what's rendered
    screen.debug();

    // Just check if the component renders without errors
    expect(document.body).toBeInTheDocument();
  });
});

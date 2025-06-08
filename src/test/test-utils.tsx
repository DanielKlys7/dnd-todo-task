import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { vi } from "vitest";

import { useTodoContextData } from "../contexts/TodoContext/useTodoContextData";
import { todoContext } from "../contexts/TodoContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import type { Column } from "../contexts/TodoContext/TodoContext.types";

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    initialColumns = [],
    ...renderOptions
  }: RenderOptions & {
    initialColumns?: Column[];
  } = {}
) => {
  const TestProviders = ({ children }: { children: React.ReactNode }) => {
    const todoContextData = useTodoContextData(initialColumns);

    return (
      <ThemeProvider>
        <todoContext.Provider value={todoContextData}>
          {children}
        </todoContext.Provider>
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: TestProviders, ...renderOptions });
};

/**
 * Mock window.matchMedia for tests
 */
export const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

/**
 * Helper to get elements by test ID
 */
export const getByTestId = (testId: string) => {
  return document.querySelector(`[data-testid="${testId}"]`) as HTMLElement;
};

/**
 * Helper to get all elements by test ID
 */
export const getAllByTestId = (testId: string) => {
  return Array.from(
    document.querySelectorAll(`[data-testid="${testId}"]`)
  ) as HTMLElement[];
};

// Re-export specific functions from testing library
export {
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
export { renderWithProviders as render };

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { JSXElementConstructor, ReactElement } from "react";

import { todoContext } from "contexts/TodoContext";
import { useTodoContextData } from "contexts/TodoContext/useTodoContextData";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const todoContextData = useTodoContextData([]);

  return (
    <todoContext.Provider value={todoContextData}>
      {children}
    </todoContext.Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customRender = (
  ui: ReactElement<any, string | JSXElementConstructor<any>>
) => ({
  ...render(ui, { wrapper: AllTheProviders }),
  user: userEvent.setup(),
});

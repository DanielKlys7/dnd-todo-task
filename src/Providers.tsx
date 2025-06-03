import { StrictMode } from "react";

import { ThemeProvider } from "@contexts/ThemeContext";
import { todoContext } from "@contexts/TodoContext";
import { useTodoContextData } from "@contexts/TodoContext/useTodoContextData";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const todoContextData = useTodoContextData();

  return (
    <StrictMode>
      <ThemeProvider>
        <todoContext.Provider value={todoContextData}>
          {children}
        </todoContext.Provider>
      </ThemeProvider>
    </StrictMode>
  );
};

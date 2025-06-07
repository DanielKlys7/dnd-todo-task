import type { ThemeContextType } from "./types";
import { createContext, useContext } from "use-context-selector";

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

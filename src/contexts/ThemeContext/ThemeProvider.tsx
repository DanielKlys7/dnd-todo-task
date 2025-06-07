import React, { useCallback, useEffect, useState } from "react";

import type { Theme } from "./types";
import { ThemeContext } from "./useTheme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem("theme") as Theme;
    return storedTheme || "system";
  });

  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  const getActualTheme = useCallback(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return theme;
  }, [theme]);

  const updateTheme = useCallback(() => {
    const newActualTheme = getActualTheme();
    setActualTheme(newActualTheme);

    const bodyElement = document.body;

    if (newActualTheme === "dark") {
      bodyElement.setAttribute("data-theme", "dark");
    } else {
      bodyElement.setAttribute("data-theme", "light");
    }
  }, [getActualTheme]);

  useEffect(() => {
    updateTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        updateTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, updateTheme, getActualTheme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, actualTheme, setTheme: handleSetTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

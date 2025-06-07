import React from "react";

import { useTheme } from "contexts/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Theme } from "contexts/ThemeContext/types";

export const ThemeToggle: React.FC = () => {
  const { theme, actualTheme, setTheme } = useTheme();

  const handleToggle = () => {
    if (theme === Theme.DARK) {
      setTheme(actualTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK);
      return;
    }

    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-4 rounded-lg bg-primary hover:bg-secondary transition-colors duration-200 text-text shadow-md hover:shadow-lg"
      aria-label={`Switch to ${
        actualTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
      } theme`}
      title={`Current: ${
        theme === "system" ? `System (${actualTheme})` : theme
      }`}
    >
      {actualTheme === "dark" ? (
        <SunIcon className="w-4 h-4" />
      ) : (
        <MoonIcon className="w-4 h-4" />
      )}
    </button>
  );
};

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export interface ThemeContextType {
  theme: Theme;
  actualTheme: Omit<Theme, "system">;
  setTheme: (theme: Theme) => void;
}

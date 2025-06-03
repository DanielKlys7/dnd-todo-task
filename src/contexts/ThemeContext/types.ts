export type Theme = 'light' | 'dark' | 'system'

export interface ThemeContextType {
  theme: Theme
  actualTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

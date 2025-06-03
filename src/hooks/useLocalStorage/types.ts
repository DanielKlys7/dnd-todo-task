export type useLocalStorage = {
  get: <T>(name: string) => T | null
  set: (name: string, data: unknown) => void
}

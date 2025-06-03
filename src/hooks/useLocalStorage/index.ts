import { type useLocalStorage as useLocalStorageType } from "./types";

export const useLocalStorage = (): useLocalStorageType => {
  const get = <T>(name: string): T | null => {
    const data = localStorage.getItem(name);
    return data ? JSON.parse(data) : null;
  };

  const set = (name: string, data: unknown) => {
    localStorage.setItem(name, JSON.stringify(data));
  };

  return {
    get,
    set,
  };
};

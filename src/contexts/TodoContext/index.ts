import { createContext } from "use-context-selector";

import type { TodoContext } from "./TodoContext.types";

export const todoContext = createContext<TodoContext | null>(null);

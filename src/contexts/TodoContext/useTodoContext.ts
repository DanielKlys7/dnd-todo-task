import { useContext } from 'use-context-selector'

import { todoContext } from '.'

export const useTodoContext = () => {
  const contextValue = useContext(todoContext)

  if (!contextValue) {
    throw new Error('useTodoContext must be used within a TodoProvider')
  }

  return contextValue
}

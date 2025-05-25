import { StateCreator } from 'zustand'

export const errorHandler = <T extends { setError: (error: string | null) => void }>(
  config: StateCreator<T>
): StateCreator<T> => (set, get, api) =>
  config(
    (...args) => {
      try {
        set(...args)
      } catch (error) {
        const state = get() as T
        state.setError(error instanceof Error ? error.message : 'An error occurred')
        console.error('Store Error:', error)
      }
    },
    get,
    api
  ) 
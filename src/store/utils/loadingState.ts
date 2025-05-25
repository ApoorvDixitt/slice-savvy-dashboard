import { StoreState } from '../types'

export const withLoading = async <T>(
  store: StoreState,
  operation: () => Promise<T>
): Promise<T> => {
  try {
    store.setLoading(true)
    store.setError(null)
    const result = await operation()
    return result
  } catch (error) {
    store.setError(error instanceof Error ? error.message : 'An error occurred')
    throw error
  } finally {
    store.setLoading(false)
  }
} 
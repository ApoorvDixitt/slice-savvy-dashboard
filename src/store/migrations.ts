import { StoreState } from './types'

type Migration = (state: any) => any

export const migrations: Record<number, Migration> = {
  1: (state: any) => ({
    ...state,
    // Add any state transformations here
    version: 1,
  }),
  // Add future migrations here
}

export const migrate = (state: any, version: number): StoreState => {
  let currentState = state

  for (let i = version; i < Object.keys(migrations).length; i++) {
    currentState = migrations[i](currentState)
  }

  return currentState
} 
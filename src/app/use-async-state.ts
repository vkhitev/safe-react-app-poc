import { useState, useEffect, useCallback, ReactElement, useRef } from 'react'
import * as Either from 'fp-ts/lib/Either'
import { AsyncState, loading, loaded, failed } from './async-state'

export const foldError = <T extends string>(
  matchers: { [key in T]: () => ReactElement | null },
) => (error: T) => {
  return matchers[error]()
}

export const useAsyncState = <T, E>(
  getData: () => Promise<Either.Either<E, T>>,
) => {
  const [state, setState] = useState<AsyncState<Either.Either<E, T>>>(loading)

  const lastRequestRef = useRef<Promise<unknown>>()

  const load = useCallback(async () => {
    setState(loading)

    try {
      const promise = getData()
      lastRequestRef.current = promise

      const value = await promise

      if (promise === lastRequestRef.current) {
        setState(loaded(value))
      }
    } catch (error) {
      if (error instanceof TypeError) {
        return setState(failed)
      }
      throw error
    }
  }, [getData])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    return () => {
      lastRequestRef.current = undefined
    }
  }, [])

  return state
}

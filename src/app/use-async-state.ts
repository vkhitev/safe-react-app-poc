import { useState, useEffect, useCallback, ReactElement, useRef } from 'react'
import * as Either from 'fp-ts/lib/Either'
import { AsyncState, loading, loaded, failed } from './async-state'
import { RequestOutput } from 'api/get-todo'
import { pipe } from 'fp-ts/lib/pipeable'

export const foldError = <T extends string>(
  matchers: { [key in T]: () => ReactElement | null },
) => (error: T) => {
  const matcher = matchers[error]
  return matcher()
}

export const useAsyncState = <T>(getData: () => Promise<RequestOutput<T>>) => {
  const [state, setState] = useState<AsyncState<T>>(loading)

  const lastRequestRef = useRef<Promise<unknown>>()

  const load = useCallback(async () => {
    setState(loading)

    const promise = getData()
    lastRequestRef.current = promise

    const value = await promise

    if (promise === lastRequestRef.current) {
      setState(pipe(value, Either.fold(failed, loaded)))
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

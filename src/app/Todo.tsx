import React, {
  useState,
  useEffect,
  useCallback,
  ReactElement,
  useRef,
} from 'react'
import * as Either from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { getTodo } from 'api/get-todo'

type Props = {
  todoId: string
}

const foldError = <T extends string>(
  matchers: { [key in T]: () => ReactElement | null },
) => (error: T) => {
  return matchers[error]()
}

const useAsyncState = <T, E>(getData: () => Promise<Either.Either<E, T>>) => {
  const [state, setState] = useState<Either.Either<E, T> | null>(null)

  const lastRequestRef = useRef<Promise<unknown>>()

  const load = useCallback(async () => {
    setState(null)

    const promise = getData()
    lastRequestRef.current = promise

    const todo = await promise

    if (promise === lastRequestRef.current) {
      setState(todo)
    }
  }, [getData])

  useEffect(() => {
    load()
  }, [load])

  return state
}

export const Todo = ({ todoId }: Props) => {
  const todoState = useAsyncState(
    useCallback(() => getTodo({ todoId }), [todoId]),
  )

  if (todoState === null) {
    return <h2>Loading</h2>
  }

  return pipe(
    todoState,
    Either.fold(
      foldError({
        error_todo_not_found: () => <h2>Todo #{todoId} not found</h2>,
      }),
      todo => (
        <div>
          <h2>
            Todo #{todo.todoId} by{' '}
            <a href={`/users/${todo.userId}`}>user #{todo.userId}</a>
          </h2>
          <dl>
            <dt>Title</dt>
            <dd>{todo.title}</dd>
            <dt>Completed</dt>
            <dd>{todo.completed ? 'Yes' : 'No'}</dd>
          </dl>
        </div>
      ),
    ),
  )
}

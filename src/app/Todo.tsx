import React, {
  useState,
  useEffect,
  useCallback,
  ReactElement,
  useRef,
} from 'react'
import * as Either from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { getTodo, Output } from 'api/get-todo'

type Props = {
  todoId: string
}

const foldError = <T extends string>(
  matchers: { [key in T]: () => ReactElement | null },
) => (error: T) => {
  return matchers[error]()
}

const useTodo = (todoId: string) => {
  const [todoState, setTodoState] = useState<Output | null>(null)

  const lastRequestRef = useRef<Promise<unknown>>()

  const loadTodo = useCallback(async () => {
    setTodoState(null)

    const promise = getTodo({ todoId })
    lastRequestRef.current = promise

    const todo = await promise

    if (promise === lastRequestRef.current) {
      setTodoState(todo)
    }
  }, [todoId])

  useEffect(() => {
    loadTodo()
  }, [loadTodo])

  return todoState
}

export const Todo = ({ todoId }: Props) => {
  const todoState = useTodo(todoId)

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

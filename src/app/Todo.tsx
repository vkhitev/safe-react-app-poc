import React, { useCallback } from 'react'
import * as Either from 'fp-ts/lib/Either'
import { getTodo } from 'api/get-todo'
import { useAsyncState, foldError } from './use-async-state'
import { foldState } from './async-state'

type Props = {
  todoId: string
}

export const Todo = ({ todoId }: Props) => {
  const todoState = useAsyncState(
    useCallback(() => getTodo({ todoId }), [todoId]),
  )

  return foldState(todoState, {
    loading: () => <h2>Loading</h2>,
    failed: foldError({
      NetworkError: () => <h2>Network Error</h2>,
      ValidationError: () => <h2>Validation Error</h2>,
    }),
    loaded: Either.fold(
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
  })
}

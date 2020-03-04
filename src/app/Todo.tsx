import React from 'react'
import * as Either from 'fp-ts/lib/Either'
import { getTodo } from 'api/get-todo'
import { foldError } from './use-async-state'
import { fold } from './async-state'
import { getUser } from 'api/get-user'
import { WithAsyncState } from './WithAsyncState'

type Props = {
  todoId: number
}

export const Todo = ({ todoId }: Props) => {
  return (
    <WithAsyncState
      task={getTodo({ todoId })}
      render={fold({
        loading: () => <h2>Loading</h2>,
        failed: foldError({
          NetworkError: () => (
            <h2 className="text-xl text-red-900">Network Error</h2>
          ),
          ValidationError: () => (
            <h2 className="text-xl text-red-900">Validation Error</h2>
          ),
        }),
        loaded: Either.fold(
          foldError({
            error_todo_not_found: () => (
              <h2 className="text-xl text-red-900">Todo #{todoId} not found</h2>
            ),
          }),
          todo => (
            <div>
              <h2 className="text-3xl mb-4">
                Todo #{todo.id} by{' '}
                <a href={`/users/${todo.userId}`}>user #{todo.userId}</a>
              </h2>
              <dl>
                <dt className="text-lg font-bold">Title</dt>
                <dd className="text-base mb-4">{todo.title}</dd>
                <dt className="text-lg font-bold">Completed</dt>
                <dd
                  className={`text-base mb-4 ${
                    todo.completed ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {todo.completed ? 'Yes' : 'No'}
                </dd>
              </dl>
              <hr className="mb-4" />

              <WithAsyncState
                task={getUser({ userId: todo.userId })}
                render={fold({
                  loading: () => <h2>Loading</h2>,
                  failed: foldError({
                    NetworkError: () => <h2>Network Error</h2>,
                    ValidationError: () => <h2>Validation Error</h2>,
                  }),
                  loaded: Either.fold(
                    foldError({
                      error_user_not_found: () => (
                        <h2>User #{todo.userId} not found</h2>
                      ),
                    }),
                    user => (
                      <div>
                        <h2>
                          User #{user.id} is {user.name}
                        </h2>
                      </div>
                    ),
                  ),
                })}
              />
            </div>
          ),
        ),
      })}
    />
  )
}

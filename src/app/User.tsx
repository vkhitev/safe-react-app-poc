import React, { useCallback } from 'react'
import * as Either from 'fp-ts/lib/Either'
import { useAsyncState, foldError } from './use-async-state'
import { foldState } from './async-state'
import { getUser } from 'api/get-user'

type Props = {
  userId: string
}

export const User = ({ userId }: Props) => {
  const userState = useAsyncState(
    useCallback(() => getUser({ userId }), [userId]),
  )

  return foldState(userState, {
    loading: () => <h2>Loading</h2>,
    failed: foldError({
      NetworkError: () => <h2>Network Error</h2>,
      ValidationError: () => <h2>Validation Error</h2>,
    }),
    loaded: Either.fold(
      foldError({
        error_user_not_found: () => <h2>User #{userId} not found</h2>,
      }),
      user => (
        <div>
          <h2>
            User #{user.id} is {user.name}
          </h2>
        </div>
      ),
    ),
  })
}

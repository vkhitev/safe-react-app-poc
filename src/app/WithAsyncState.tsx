import { ReactElement } from 'react'
import { useAsyncState } from './use-async-state'
import { AsyncState, FailureReason } from './async-state'
import { Either } from 'fp-ts/lib/Either'
import { TaskEither } from 'fp-ts/lib/TaskEither'

type Props<E, T> = {
  task: TaskEither<FailureReason, Either<E, T>>
  render: (state: AsyncState<Either<E, T>>) => ReactElement | null
}

export const WithAsyncState = <E, T>({ task, render }: Props<E, T>) => {
  return render(useAsyncState(task))
}

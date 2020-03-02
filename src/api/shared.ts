import * as t from 'io-ts'
import * as Either from 'fp-ts/lib/Either'
import { FailureReason } from 'app/async-state'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TaskEither from 'fp-ts/lib/TaskEither'
import { flow } from 'fp-ts/lib/function'

export const request = (
  ...args: Parameters<typeof fetch>
): TaskEither.TaskEither<'NetworkError', Response> => {
  return TaskEither.tryCatch(
    async () => {
      return window.fetch(...args)
    },
    () => 'NetworkError',
  )
}

export const toJson = (
  res: Response,
): TaskEither.TaskEither<FailureReason, unknown> => {
  return TaskEither.tryCatch(
    async () => {
      return res.json()
    },
    () => 'ValidationError',
  )
}

export const readJson = <E>(
  eitherRes: Either.Either<E, Response>,
): TaskEither.TaskEither<FailureReason, Either.Either<E, unknown>> => {
  return pipe(
    eitherRes,
    Either.fold(
      left => TaskEither.right(Either.left(left)),
      right =>
        pipe(
          toJson(right),
          TaskEither.chain(json => {
            return TaskEither.right(Either.right(json))
          }),
        ),
    ),
  )
}

export const decodeJson = <E, A, O>(codec: t.Type<A, O>) => (
  eitherJson: Either.Either<E, unknown>,
): TaskEither.TaskEither<FailureReason, Either.Either<E, A>> => {
  return pipe(
    eitherJson,
    Either.fold(
      left => TaskEither.right(Either.left(left)),
      right =>
        pipe(
          codec.decode(right),
          Either.fold(
            () => TaskEither.left('ValidationError'),
            right => TaskEither.right(Either.right(right)),
          ),
        ),
    ),
  )
}

export const readDecodeJson = <E, A, O>(codec: t.Type<A, O>) => (
  ma: TaskEither.TaskEither<FailureReason, Either.Either<E, Response>>,
) => flow(TaskEither.chain(readJson), TaskEither.chain(decodeJson(codec)))(ma)

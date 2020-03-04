import * as t from 'io-ts'
import * as Either from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import * as TaskEither from 'fp-ts/lib/TaskEither'
import { request, readDecodeJson } from './shared'
import { memoizeDeep } from './memoize-deep'

type Input = {
  todoId: number
}

const TodoCodec = t.type({
  id: t.number,
  userId: t.number,
  title: t.string,
  completed: t.boolean,
})

export const getTodo = memoizeDeep(
  flow(
    ({ todoId }: Input) =>
      request(`https://jsonplaceholder.typicode.com/todos/${todoId}`),

    TaskEither.map(res => {
      if (res.status === 404) {
        return Either.left('error_todo_not_found' as const)
      }
      return Either.right(res)
    }),

    readDecodeJson(TodoCodec),
  ),
)

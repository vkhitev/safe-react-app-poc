import * as t from 'io-ts'
import * as Either from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import * as TaskEither from 'fp-ts/lib/TaskEither'
import * as Task from 'fp-ts/lib/Task'
import { request, readDecodeJson } from './shared'

type Input = {
  todoId: string
}

const TodoCodec = t.type({
  id: t.number,
  userId: t.number,
  title: t.string,
  completed: t.boolean,
})

const randomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getTodo = flow(
  ({ todoId }: Input) =>
    request(`https://jsonplaceholder.typicode.com/todos/${todoId}`),

  ma => Task.delay(randomInteger(500, 1000))(ma),

  TaskEither.chain(ma => {
    const shouldThrow = randomInteger(0, 10) > 7
    if (shouldThrow) {
      return TaskEither.left('NetworkError' as const)
    }
    return TaskEither.right(ma)
  }),

  TaskEither.map(res => {
    if (res.status === 404) {
      return Either.left('error_todo_not_found' as const)
    }
    return Either.right(res)
  }),

  readDecodeJson(TodoCodec),
)

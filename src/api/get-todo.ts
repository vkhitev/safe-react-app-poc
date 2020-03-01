import * as t from 'io-ts'
import * as Either from 'fp-ts/lib/Either'
import { FailureReason } from 'app/async-state'

type Input = {
  todoId: string
}

const TodoCodec = t.type({
  id: t.number,
  userId: t.number,
  title: t.string,
  completed: t.boolean,
})

export type TodoModel = {
  todoId: string
  userId: string
  title: string
  completed: boolean
}

export type RequestOutput<T> = Either.Either<FailureReason, T>

export type ResponseError = 'error_todo_not_found'

export type Output = RequestOutput<Either.Either<ResponseError, TodoModel>>

const randomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

export const getTodo = async ({ todoId }: Input): Promise<Output> => {
  try {
    await sleep(randomInteger(500, 1000))

    const shouldThrow = randomInteger(0, 10) > 7
    if (shouldThrow) {
      throw new TypeError('Failed to fetch')
    }
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId}`,
    )

    if (res.status === 404) {
      return Either.right(Either.left('error_todo_not_found'))
    }

    const body: unknown = await res.json()

    const validatedBody = TodoCodec.decode(body)

    if (Either.isLeft(validatedBody)) {
      return Either.left('ValidationError')
    }

    const value = validatedBody.right

    return Either.right(
      Either.right({
        todoId: value.id.toString(),
        userId: value.userId.toString(),
        title: value.title,
        completed: value.completed,
      }),
    )
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return Either.left('NetworkError')
    }
    if (error instanceof SyntaxError) {
      return Either.left('ValidationError')
    }
    throw error
  }
}

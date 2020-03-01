import * as Either from 'fp-ts/lib/Either'

type Input = {
  todoId: string
}

type ResponseOutput = {
  id: number
  userId: number
  title: string
  completed: boolean
}

export type TodoModel = {
  todoId: string
  userId: string
  title: string
  completed: boolean
}

export type ResponseError = 'error_todo_not_found'

export type Output = Either.Either<ResponseError, TodoModel>

export const getTodo = async ({ todoId }: Input): Promise<Output> => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`,
  )

  if (res.status === 404) {
    return Either.left('error_todo_not_found')
  }

  const body: ResponseOutput = await res.json()

  return Either.right({
    todoId: body.id.toString(),
    userId: body.userId.toString(),
    title: body.title,
    completed: body.completed,
  })
}

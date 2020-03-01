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

export const getTodo = async ({ todoId }: Input): Promise<TodoModel> => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`,
  )
  const body: ResponseOutput = await res.json()

  return {
    todoId: body.id.toString(),
    userId: body.userId.toString(),
    title: body.title,
    completed: body.completed,
  }
}

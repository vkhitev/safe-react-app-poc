import React, { useState, useEffect, useCallback } from 'react'
import { getTodo, TodoModel } from 'api/get-todo'

type Props = {
  todoId: string
}

export const Todo = ({ todoId }: Props) => {
  const [todoState, setTodoState] = useState<TodoModel | null>(null)

  const loadTodo = useCallback(async () => {
    const todo = await getTodo({ todoId })
    setTodoState(todo)
  }, [todoId])

  useEffect(() => {
    loadTodo()
  }, [loadTodo])

  if (todoState === null) {
    return null
  }

  return (
    <div>
      <h2>
        Todo #{todoState.todoId} by{' '}
        <a href={`/users/${todoState.userId}`}>user #{todoState.userId}</a>
      </h2>
      <dl>
        <dt>Title</dt>
        <dd>{todoState.title}</dd>
        <dt>Completed</dt>
        <dd>{todoState.completed ? 'Yes' : 'No'}</dd>
      </dl>
    </div>
  )
}

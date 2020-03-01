import React, { useState, useCallback } from 'react'
import { Todo } from 'app/Todo'
import { increment, decrement } from 'fp-ts/lib/function'
import { User } from 'app/User'

export const App = () => {
  const [counter, setCounter] = useState(1)

  const nextId = useCallback(() => {
    setCounter(increment)
  }, [])

  const prevId = useCallback(() => {
    setCounter(decrement)
  }, [])

  return (
    <div>
      <button onClick={prevId}>Prev</button>
      <button onClick={nextId}>Next</button>
      <Todo todoId={counter.toString()} />
      <User userId="1" />
    </div>
  )
}

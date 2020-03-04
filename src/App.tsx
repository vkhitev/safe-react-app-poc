import React, { useState, useCallback } from 'react'
import { Todo } from 'app/Todo'
import { increment, decrement } from 'fp-ts/lib/function'

export const App = () => {
  const [counter, setCounter] = useState(1)

  const nextId = useCallback(() => {
    setCounter(increment)
  }, [])

  const prevId = useCallback(() => {
    setCounter(decrement)
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-sm rounded overflow-hidden shadow-lg p-6 w-full max-w-sm">
        <div className="mb-3">
          <Todo todoId={counter} />
        </div>
        <div className="flex justify-between">
          <button onClick={prevId} className="btn btn-primary mr-3">
            Prev
          </button>
          <button onClick={nextId} className="btn btn-primary">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

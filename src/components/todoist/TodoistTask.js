import React from 'react'

const TodoistTask = ({task}) => {
  return (
        <div className="p-2 m-2 rounded shadow-xl border border-b">
            {task.content}
        </div>
  )
}

export default TodoistTask
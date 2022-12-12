import React from 'react'
import { SiTodoist } from "react-icons/si";

const TodoistTask = ({task}) => {
  return (
        <div className="p-2 m-2 rounded shadow-xl border border-b flex items-center">
          <SiTodoist size={15} color={'red'} className="mr-1"/>
            {task.content}
        </div>
  )
}

export default TodoistTask
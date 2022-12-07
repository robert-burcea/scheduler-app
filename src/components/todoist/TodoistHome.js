import React from 'react'
import TodoistProject from './TodoistProject'

const TodoistHome = ({data}) => {
  return (
    <div>
        {console.log("data in home:", data)}
        <TodoistProject data={data}/>
    </div>
  )
}

export default TodoistHome
import React from 'react'
import TodoistTask from './TodoistTask'

const TodoistProject = ({data}) => {
  return (
    <div>{data ? data?.todoist.map((project, todoistIndex) => {
        return <div className="shadow-xl" key={todoistIndex}>
            <h1 className="text-xl">{project.name}</h1>
            {project.tasks.map((task, taskIndex) => {
                    return <TodoistTask task={task}/>
                })}
            </div>
        }) : <></>}</div>
  )
}

export default TodoistProject
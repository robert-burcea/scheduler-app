import React from 'react'
import TodoistTask from './TodoistTask'

const TodoistProject = ({data}) => {
  return (
    <div>{data ? data?.todoist.map((project) => {
        return <div className="shadow-xl">
            <h1 className="text-xl">{project.name}</h1>
            {project.tasks.map((task) => {
                    return <TodoistTask task={task}/>
                })}
            </div>
        }) : <></>}</div>
  )
}

export default TodoistProject
import React from 'react'
import TodoistTask from './TodoistTask'

const TodoistProject = ({data}) => {
  return (
    <div>{data ? data?.todoist?.map((project, index) => {
        return <div className="shadow-xl" key={index}>
            <h1 className="text-xl">{project?.name}</h1>
            {project?.tasks?.map((task, index) => {
                    return <TodoistTask task={task} key={index}/>
                })}
            </div>
        }) : <></>}</div>
  )
}

export default TodoistProject
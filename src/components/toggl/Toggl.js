import React from 'react'
import {useData, useSetData} from '../../GlobalContext'
import TodoistTask from '../todoist/TodoistTask';
import TogglProject from './TogglProject';

const Toggl = () => {

  const data = useData();
  const setData = useSetData();
  
  return (
    <div>
      {/* it firsts sorts the projects, min hours spent to max hours spent on it, then maps it */}
      {console.log("DATA IN TOGGL COMPONENT:", data)}
      {data ? data?.toggl?.togglProjects?.sort((a,b) => a.actual_hours-b.actual_hours).map((togglProject) => {
        let todoistTasksMatchingTogglProject = [];
        data?.todoist?.forEach((todoistProject) => {
          if(todoistProject.name.toLowerCase() === togglProject.name.toLowerCase())
            todoistTasksMatchingTogglProject.push(...todoistProject.tasks)
        })
        return (
          <div>
            <TogglProject project={togglProject}/>
            {todoistTasksMatchingTogglProject?.map((task, index) => {
              return <TodoistTask task={task} key={index}/>
            })}
          </div>
        )
      }) : <div></div>}
    </div>
  )
}

export default Toggl
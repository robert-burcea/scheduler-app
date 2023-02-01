import React from 'react'
import TodoistTask from '../components/todoist/TodoistTask'
import {Toggl} from '../components/toggl/Toggl'
import TogglProject from '../components/toggl/TogglProject'
import {useData, useSetData} from '../GlobalContext'

const togglApiKey = '77102011f8bf9ad5b1edf9f7df4fcaae'

const Home = () => {

  const data = useData();
  const setData = useSetData();

  return (
    <div className="m-2">
        <div><TogglProject project={data?.leastWorkedProject?.project}/></div>
        <div>{data?.leastWorkedProject?.tasks?.map((task, index) => {
          return <TodoistTask task={task} key={index}/>
        })}</div>
    </div>
  )
}

export default Home
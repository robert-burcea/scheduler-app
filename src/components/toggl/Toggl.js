import React from 'react'
import {useData, useSetData} from '../../GlobalContext'
import TogglProject from './TogglProject';

const Toggl = () => {

  const data = useData();
  const setData = useSetData();
  
  return (
    <div>
      {data ? data?.toggl?.togglProjects?.map((project) => {
        return (
          <TogglProject project={project}/>
        )
      }) : <div></div>}
    </div>
  )
}

export default Toggl
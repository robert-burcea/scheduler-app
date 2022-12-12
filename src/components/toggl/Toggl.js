import React from 'react'
import {useData, useSetData} from '../../GlobalContext'

const Toggl = () => {

  const data = useData();
  const setData = useSetData();
  
  return (
    <div>
      {data ? data?.toggl?.togglProjects?.map((project) => {
        return (
          <div>{project.name}</div>
        )
      }) : <div></div>}
    </div>
  )
}

export default Toggl
import React from 'react'
import {useData, useSetData} from '../../GlobalContext'

const Toggl = () => {

  const data = useData();
  const setData = useSetData();
  
  return (
    <div>
      {console.log(data)}
    </div>
  )
}

export default Toggl
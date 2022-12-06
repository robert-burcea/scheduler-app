import React from 'react'
import Todoist from '../components/todoist/Todoist'
import {Toggl} from '../components/toggl/Toggl'
import {useData, useSetData} from '../GlobalContext'

const togglApiKey = '77102011f8bf9ad5b1edf9f7df4fcaae'

const Home = () => {

  const data = useData();
  const setData = useSetData();

  return (
    <div>
        {}
        <Todoist />
    </div>
  )
}

export default Home
import React, { useEffect, useState } from 'react'
import { TodoistApi } from "@doist/todoist-api-typescript"
import {useData, useSetData} from '../../GlobalContext'
import TodoistHome from './TodoistHome'

const api = new TodoistApi('7f66b2bae0474b388209dce9c4a16a6578fc8e6b')

const Todoist = () => {

    const data = useData();
    const setData = useSetData();

    return (
    <div className="">
        {console.log("Data reaching Todoist", data)}
        <TodoistHome data={data}/>
    </div>
  )
}

export default Todoist
import React, { useEffect, useState } from 'react'
import { TodoistApi } from "@doist/todoist-api-typescript"
import {useData, useSetData} from '../../GlobalContext'

const api = new TodoistApi('7f66b2bae0474b388209dce9c4a16a6578fc8e6b')

const Todoist = () => {

    const data = useData();
    const setData = useSetData();

    return (
    <div>
        {data?.todoist ? data?.todoist?.map((p) => {
        return <div>
            <h1 className="text-xl">{p.name}</h1>
                <h2 className="mx-3">{p.tasks.map((t) => {
                    return <p>{t.content}</p>
                })}</h2>
            </div>
        }) : <></>}
    </div>
  )
}

export default Todoist
import React, { useEffect, useState } from 'react'
import { TodoistApi } from "@doist/todoist-api-typescript"
import {useData, useSetData} from '../../GlobalContext'

const api = new TodoistApi('7f66b2bae0474b388209dce9c4a16a6578fc8e6b')

const Todoist = () => {

    const data = useData();
    const setData = useSetData();

    return (
    <div className="m-2 max-w-[100%] max-h-[100%] h-full w-full mx-auto 
    flex flex-col">
        {console.log("Data reaching Todoist", data)}
        {data?.todoist ? data?.todoist?.map((p) => {
        return <div>
            <h1 className="text-xl">{p.name}</h1>
                <span className="max-w-[100%] max-h-[100%] mx-auto">
                    {p.tasks.map((t) => {
                    return <span className="max-w-[100%] max-h-[100%] mx-auto text-clip overflow-hidden">
                        {t.content}
                        </span>
                })}
                </span>
            </div>
        }) : <></>}
    </div>
  )
}

export default Todoist
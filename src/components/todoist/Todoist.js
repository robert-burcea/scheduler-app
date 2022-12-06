import React, { useEffect, useState } from 'react'
import { TodoistApi } from "@doist/todoist-api-typescript"
import {useData, useSetData} from '../../GlobalContext'

const api = new TodoistApi('7f66b2bae0474b388209dce9c4a16a6578fc8e6b')

const Todoist = () => {

    const data = useData();
    const setData = useSetData();

    return (
    <div className="">
        {console.log("Data reaching Todoist", data)}
        {data?.todoist ? data?.todoist?.map((p) => {
        return <div>
            <h1 className="text-xl">{p.name}</h1>
                <div className="">
                    {p.tasks.map((t) => {
                    return <div className="overflow-hidden">
                        {t.content}
                        </div>
                })}
                </div>
            </div>
        }) : <></>}
    </div>
  )
}

export default Todoist
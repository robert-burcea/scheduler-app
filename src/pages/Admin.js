import React, {useState} from 'react'
import {useData, useSetData} from '../GlobalContext'

const Admin = () => {
  const data = useData();
  const setData = useSetData();
  const [togglApiKey, setTogglApiKey] = useState();
  const [todoistApiKey, setTodoistApiKey] = useState();

  const onChangeTodoist = (e) => {
    setTodoistApiKey(e.target.value)
    console.log(todoistApiKey)
  }
  const onChangeToggl = (e) => {
    setTogglApiKey(e.target.value)
    console.log(togglApiKey)
  }
  const onSubmit = () => {
    if(togglApiKey.length > 5 && todoistApiKey.length > 5)
      setData({...data, apis: {value: true, toggl: togglApiKey, todoist: todoistApiKey}})
  }


  return (
    <div className="m-1 p-1 max-w-[100%] flex flex-col items-center">
        <div>Insert Todoist API KEY</div>
        <input
        className="text-black"
        type="text" 
        placeholder="Todoist API KEY"
        onChange={onChangeTodoist}></input>
        <div>Insert Toggl API KEY</div>
        <input 
        className="text-black"
        type="text" 
        placeholder="Toggl API KEY"
        onChange={onChangeToggl}></input>
        <button 
        className="bg-red-500 m-2 p-1 text-xl rounded"
        onClick={onSubmit}>SUBMIT API's</button>
    </div>
  )
}

export default Admin
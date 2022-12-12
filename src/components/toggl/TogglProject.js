import React from 'react'
import { SiToggl } from "react-icons/si";

const TogglProject = ({project}) => {

  return (
    <div className="m-1 p-2 mx-auto max-w-[90%] border rounded flex items-center">
        <SiToggl size={15} color={'#a04a97'} className="mr-1"/>
        <h1 className="text-xl">{project.name}</h1>
        <div className="ml-1 text-xs text-red-400">{project.actual_hours} hours</div>
    </div>
  )
}

export default TogglProject
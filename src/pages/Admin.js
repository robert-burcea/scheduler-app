import React from 'react'
import Targets from '../components/admin/Targets'

const Admin = ({compoundedProjectsAndTasksCreator, getLeastWorkedProject}) => {
  return (
    <div><Targets 
              compoundedProjectsAndTasksCreator={compoundedProjectsAndTasksCreator}
              getLeastWorkedProject={getLeastWorkedProject}
    /></div>
  )
}

export default Admin
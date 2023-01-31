import React, { useEffect, useState } from "react";
import db, { updateFirebaseWeekTargets } from "../../firebase";
import {useData, useSetData} from '../../GlobalContext'


const Targets = () => {
  const data = useData();
  const setData = useSetData();
  const [succesfull, setSuccesfull] = useState(false)
  const [weekTargets, setWeekTargets] = useState(data?.user?.weekTargets || [])
  const [firebaseTargets, setFirebaseTargets] = useState(data?.user?.weekTargets || null)
  const [togglProjectsTargets, setTogglProjectsTargets] = useState(data?.toggl?.togglProjects);

  const handleChange = (index, value) => {
    const newData = [...togglProjectsTargets];
    const newWeekTargets = [...weekTargets];
    newData[index].weekTarget = value;
    const weekTargetIndex = newWeekTargets.findIndex(obj => obj.id === newData[index].id)
    newWeekTargets[weekTargetIndex].weekTarget = value;
    setTogglProjectsTargets(newData);
    setWeekTargets(newWeekTargets);
  };

  const createWeekTargetsArray = () => {
    var newWeekTargets = []
    togglProjectsTargets.forEach((project, index) => {
      newWeekTargets[index] = {id: project.id, name: project.name}
    })
    setWeekTargets(newWeekTargets);
  }

  const updateData = () => {
    const tempData = data;
    tempData.toggl.weekTargets = togglProjectsTargets;
    tempData.reload = true;
    const compoundedProjectsAndTasks = compoundedProjectsAndTasksCreator();
    console.log("Compounded:", compoundedProjectsAndTasks)
    const leastWorkedProject = getLeastWorkedProject(compoundedProjectsAndTasks);
    setData({...tempData, leastWorkedProject: leastWorkedProject, reload: false})
    updateFirebaseWeekTargets(data.user, weekTargets);
    setSuccesfull(true);
  }
    //compounds projects that E both in todoist and toggl, and gets the corresponding tasks from todoist
    const compoundedProjectsAndTasksCreator = () => {
      var compoundedProjectsAndTasks = []; //will store the projects and corresponding tasks
      //cycles through every toggl Project after first sorting them Asc by hours spend (first is project with 0 hours)
      data?.toggl?.togglProjects?.sort((a,b) => a.actual_hours-b.actual_hours).map((togglProject) => {
        let todoistTasksMatchingTogglProject = [];
        //cycles through todoist projects and checks if it matches the name with the toggl project, if it does, it saves the tasks and the name of project
        //in compoundedProjectsAndTasks
        data?.todoist?.forEach((todoistProject) => {
          if(JSON.stringify(todoistProject.name.toLowerCase()) === JSON.stringify(togglProject.name.toLowerCase()))
            todoistTasksMatchingTogglProject.push(...todoistProject.tasks)
        })
        if(todoistTasksMatchingTogglProject.length > 0){
          compoundedProjectsAndTasks.push({project:togglProject, tasks:todoistTasksMatchingTogglProject})
        }
      })
      console.log("CompoundedProjectsAndTasks:", compoundedProjectsAndTasks)
      return compoundedProjectsAndTasks;
    }

    const getLeastWorkedProject = (compoundedProjectsAndTasks) => {
      var leastWorkedProject = compoundedProjectsAndTasks[0];
      compoundedProjectsAndTasks?.map((project) => {
        if(project?.weekTarget - project?.calculatedDuration/60/60 > leastWorkedProject?.weekTarget - leastWorkedProject?.calculatedDuration/60/60)
          leastWorkedProject = project;
      })  
      return leastWorkedProject;
    }

  const dateCheck = () => {
    let date = new Date();
  let formattedDate = date.toISOString().substr(0, 10);
  console.log("Dateeee", formattedDate);
  }

  useEffect(() => {
    if(!data?.user?.weekTargets)
      createWeekTargetsArray()
  },[])

  return (
    <div>
      {togglProjectsTargets?.map((item, index) => (
        <div key={index}>
          <p>{item.name}</p>
          <input
            type="range"
            min="0"
            max="100"
            value={item.weekTarget || 0}
            onChange={event => handleChange(index, event.target.value)}
          />
          <p>{item.weekTarget || 0} hours/week</p>
        </div>
      ))}
      <button 
      className={succesfull ? `shadow shadow-xl bg-green-300 rounded-xl p-2 m-2 hover:scale-[1.2]` : 
      `shadow shadow-xl bg-blue-300 rounded-xl p-2 m-2 hover:scale-[1.2]`} 
      onClick={updateData}>
        SAVE CHANGES
        </button>
        {dateCheck()}
    </div>
  );
};

export default Targets;

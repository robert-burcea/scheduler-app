import React, { useEffect, useState } from "react";
import db, { updateFirebaseWeekTargets } from "../../firebase";
import {useData, useSetData} from '../../GlobalContext'


const Targets = ({compoundedProjectsAndTasksCreator, getLeastWorkedProject}) => {
  const data = useData();
  const setData = useSetData();
  const [succesfull, setSuccesfull] = useState(false)
  const [weekTargetsFromFirebase, setWeekTargetsFromFirebase] = useState(data?.user?.weekTargets || [])
  const [firebaseTargets, setFirebaseTargets] = useState(data?.user?.weekTargets || null)
  const [togglProjectsReceived, setTogglProjectsReceived] = useState(data?.toggl?.togglProjects);

  const handleChange = (index, value) => {
    const newWeekTargets = [...weekTargetsFromFirebase];
    //const weekTargetIndex = newWeekTargets.findIndex(obj => obj.id === newCalculatedTargets[index].id)
    newWeekTargets[index].weekTarget = value;
    setWeekTargetsFromFirebase(newWeekTargets);
  };

  const createWeekTargetsArray = () => {
    var newWeekTargets = []
    togglProjectsReceived?.forEach((project, index) => {
      newWeekTargets[index] = {id: project.id, name: project.name, weekTarget: 0}
    })
    setWeekTargetsFromFirebase(newWeekTargets);
  }

  const updateData = () => {
    const tempData = data;
    tempData.user.weekTargets = weekTargetsFromFirebase;
    tempData.reload = true;
    const compoundedProjectsAndTasks = compoundedProjectsAndTasksCreator();
    console.log("Compounded:", compoundedProjectsAndTasks)
    const leastWorkedProject = getLeastWorkedProject(compoundedProjectsAndTasks);
    setData({...tempData, leastWorkedProject: leastWorkedProject, reload: false})
    updateFirebaseWeekTargets(data.user, weekTargetsFromFirebase);
    setSuccesfull(true);
  }

  const dateCheck = () => {
    let date = new Date();
  let formattedDate = date.toISOString().substr(0, 10);
  console.log("Dateeee", formattedDate);
  }

  useEffect(() => {
    if(data?.user?.weekTargets.length === 0)
      createWeekTargetsArray()
  },[])

  return (
    <div>
      {weekTargetsFromFirebase?.map((item, index) => (
        <div key={index}>
          <p>{item.name}</p>
          <input
            type="range"
            min="0"
            max="100"
            value={item.weekTarget}
            onChange={event => handleChange(index, event.target.value)}
          />
          <p>{item.weekTarget} hours/week</p>
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

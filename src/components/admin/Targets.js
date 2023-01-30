import React, { useState } from "react";
import {useData, useSetData} from '../../GlobalContext'

const Targets = () => {
  const data = useData();
  const setData = useSetData();
  const [togglProjectsTargets, setTogglProjectsTargets] = useState(data.toggl.togglProjects);

  const handleChange = (index, value) => {
    const newData = [...togglProjectsTargets];
    newData[index].weekTarget = value;
    setTogglProjectsTargets(newData);
  };
  const updateData = () => {
    const tempData = data;
    tempData.toggl.togglProjects = togglProjectsTargets;
    setData(tempData)
  }

  return (
    <div>
      {togglProjectsTargets.map((item, index) => (
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
      <button className="shadow shadow-xl bg-green-300 rounded-xl p-2 m-2 hover:scale-[1.2]" onClick={updateData}>SAVE CHANGES</button>
    </div>
  );
};

export default Targets;

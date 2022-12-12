import React, { useEffect, useState } from 'react';
import Todoist from "./components/todoist/Todoist";
import Toggl from "./components/toggl/Toggl";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Home from './pages/Home';
import {useData, useSetData} from './GlobalContext'
import db from './firebase'
import { 
    collection, onSnapshot, doc, setDoc, updateDoc
  } from 'firebase/firestore'
  import { TodoistApi } from "@doist/todoist-api-typescript"
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import axios from 'axios'

const togglApiKey = '77102011f8bf9ad5b1edf9f7df4fcaae'
const api = new TodoistApi('7f66b2bae0474b388209dce9c4a16a6578fc8e6b')

function App() {
  //data and setData are the subscriptions to the Global Context
  const data = useData();
  const setData = useSetData();
  //dbData is the data fetched from firebase
  const [dbData, setDbData] = useState({})
  const [togglProjects, setTogglProjects] = useState();
  const [togglTimeEntries, setTogglTimeEntries] = useState();
  const [togglMe, setTogglMe] = useState();
  const [readyToggl, setReadyToggl] = useState(false);
  //if the TODOIST AND TOGGL DATA WAS FETCHED, ready triggers the FIREBASE UPDATE WITH THE DATA
  const [readyTodoist, setReadyTodoist] = useState(false);

  /* *********FIREBASE FUNCTIONS************ */

  const firebaseDataFetch = () => {
        
    const colRef = collection(db, 'users')

    onSnapshot(colRef, (snapshot) => {
        let dbCopy = null;
        snapshot.docs.forEach((doc) => {
          dbCopy = doc.data();
        })
        setDbData({...dbCopy});
    })
  }
  const firebaseUpdateData = () => {
    updateDoc(doc(db, "users", "robert"), {...data}).then(console.log("Doc set!"))
  }

  /* **********TODOIST FUNCTIONS************* */

  //fetches the data from TODOIST
  const getTodoistData = () => {
    //fetches TODOIST projects
    api.getProjects()
    .then((projects) => {
      api.getTasks()
      .then((tasks) => {
        combineTodoistData(projects,tasks)
      })
    })
    .catch((error) => console.log(error))
    //fetches TODOIST tasks
    /*api.getTasks()
    .then((tasks) => {setTasks(tasks); console.log(tasks)})
    .catch((error) => console.log(error))*/
  }

  const refreshTodoist = () => {
    getTodoistData()
  }

  const combineTodoistData = (projects, tasks) => {
    //creates empty array that will be the modified projects 
    //where each project will have an obj 'tasks' (the tasks corresponding to the project)
    let newProjects = [];
    //cicles through every project in search of tasks that belong to the current project
    for(let i = 0; i < projects?.length; i++) {
        //creates empty array to store found tasks
        let project = projects[i];
        let tasksBelongingToProject = [];
        tasks?.forEach((task) => {
            //if the id of the task's projectId matches the project id
            if(task.projectId === project.id)
            {
                tasksBelongingToProject.push(task)
            }
        })
        project.tasks = tasksBelongingToProject;
        newProjects.push(project)
    }
    setData({...data, todoist: newProjects})
    setReadyTodoist(true)
}

  /* ************TOGGL FUNCTIONS************* */

  /***************TOGGL GET *********************** */

  const getTogglMe = async () => {
    try {
      const resp = await axios({
      method:'get',
      url:"https://api.track.toggl.com/api/v9/me",
      headers: {
        "Content-Type": "application/json",
    "Authorization": `Basic ${btoa(`${togglApiKey}:api_token`)}`}
      })
      setTogglMe(resp.data)
  }
  catch (err) {
    console.log(err)
  }
  }

  const getTogglProjects = async () => {
    try {
      const resp = await axios({
      method:'get',
      url:"https://api.track.toggl.com/api/v9/workspaces/5324929/projects",
      headers: {
        "Content-Type": "application/json",
    "Authorization": `Basic ${btoa(`${togglApiKey}:api_token`)}`}
      })
      setTogglProjects(resp.data)
  }
  catch (err) {
    console.log(err)
  }
}

  const getTogglTimeEntries = async () => {
    try {
      const resp = await axios({
      method:'get',
      url:"https://api.track.toggl.com/api/v9/me/time_entries",
      headers: {
        "Content-Type": "application/json",
    "Authorization": `Basic ${btoa(`${togglApiKey}:api_token`)}`}
      })
      setTogglTimeEntries(resp.data)
  }
  catch (err) {
    console.log(err)
  }
}

  const retrieveAllTogglInfo = () => {
    getTogglMe()
    getTogglProjects()
    getTogglTimeEntries();
    setReadyToggl(true);
    console.log("TOGGL ME STATE:", togglMe)
    console.log("TOGGL PROJ STATE", togglProjects)
    console.log("TOGGL TE STATE:", togglTimeEntries)
    setData({...data, toggl: { togglMe:togglMe, togglProjects:togglProjects, togglTimeEntries:togglTimeEntries}})
  }

  /***************TOGGL UPDATE *********************** */

  const updateTogglProject = (workspaceId, projectId) => {
    fetch(`https://api.track.toggl.com/api/v9/workspaces/${workspaceId}/projects/${projectId}`, {
  method: "PUT",
  body: {"active":"boolean","auto_estimates":"boolean","billable":"boolean","cid":"integer","client_id":"integer",
  "client_name":"string","color":"string","currency":"string","end_date":"string","estimated_hours":"integer",
  "fixed_fee":"number","is_private":"boolean","name":"string","rate":"number","rate_change_mode":"string","recurring":"boolean",
  "recurring_parameters":{"custom_period":"integer","period":"string","project_start_date":"string"},"start_date":"string","template":"boolean","template_id":"integer"},
  headers: {
    "Content-Type": "application/json",
"Authorization": `Basic ${btoa(`${togglApiKey}:api_token`)}`
  },
})
.then((resp) => resp.json())
.then((json) => {
  console.log(json);
})
.catch(err => console.error(err));
  }

  /* **************************************** */

  //fetches data from toggl and todoist one time when app starts
  useEffect(() => {
    getTodoistData();
   },[])
   useEffect(() => {
   retrieveAllTogglInfo()
   },[])
  useEffect(() => { 
    //updates the new received data in firebase, this will be done live on all devices
    firebaseUpdateData();
    setReadyTodoist(false);
  },[])
  useEffect(() => {
    //firebaseDataFetch();
  },[])
  //sets the firebase data into the global context
  useEffect(() => { 
    //setData(dbData)
  },[dbData])

  return (
    <Router>
      <div className="bg-[#412a4c] w-full h-screen mx-auto max-w-[100%] text-white">
        <div className=""><Navbar /></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/toggl" element={<Toggl />} />
          <Route path="/todoist" element={<Todoist />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

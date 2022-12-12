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
const todoistApi = new TodoistApi('7f66b2bae0474b388209dce9c4a16a6578fc8e6b')

function App() {
  //data and setData are the subscriptions to the Global Context
  const data = useData();
  const setData = useSetData();
  //dbData is the data fetched from firebase
  const [dbData, setDbData] = useState({})
  const [togglProjects, setTogglProjects] = useState();
  const [togglTimeEntries, setTogglTimeEntries] = useState();
  const [togglMe, setTogglMe] = useState();
  const [todoistData, setTodoistData] = useState();
  const [readyTodoist, setReadyTodoist] = useState(false)
  const [readyTogglProjects, setReadyTogglProjects] = useState(false)
  const [readyTogglTimeEntries, setReadyTogglTimeEntries] = useState(false)
  const [readyTogglMe, setReadyTogglMe] = useState(false);
  const [readyAllToggl, setReadyAllToggl] = useState(false);
  //if the TODOIST AND TOGGL DATA WAS FETCHED, ready triggers the FIREBASE UPDATE WITH THE DATA

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
    todoistApi.getProjects()
    .then((projects) => {
      todoistApi.getTasks()
      .then((tasks) => {
        combineTodoistData(projects,tasks)
      })
    })
    .catch((error) => console.log(error))
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
    setTodoistData(newProjects)
    setReadyTodoist(true)
}

  /* ************TOGGL FUNCTIONS************* */

  /***************TOGGL GET *********************** */

  const getTogglMe = async () => {
    try {
      await axios.get("https://api.track.toggl.com/api/v9/me", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    "Authorization": `Basic ${btoa(`${togglApiKey}:api_token`)}`}
      }).then((resp) => {
        setTogglMe(resp.data)
        setReadyTogglMe(true)
      })
  }
  catch (err) {
    console.log(err)
  }
  }

  const getTogglProjects = (default_workspace_id) => {
    try {
      axios.get(`https://api.track.toggl.com/api/v9/workspaces/${default_workspace_id}/projects`,{
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    "Authorization": `Basic ${btoa(`${togglApiKey}:api_token`)}`}
      }).then((resp) => {
        setTogglProjects(resp.data);
        setReadyTogglProjects(true);
      })
  }
  catch (err) {
    console.log(err)
  }
}

  const getTogglTimeEntries = () => {
    try {
      axios.get("https://api.track.toggl.com/api/v9/me/time_entries", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    "Authorization": `Basic ${btoa(`${togglApiKey}:api_token`)}`}
      }).then((resp) => {
        setTogglTimeEntries(resp.data);
        setReadyTogglTimeEntries(true);
      })
  }
  catch (err) {
    console.log(err)
  }
}

  const fetchTodoistAndTogglInfo = () => {
    getTodoistData();
    getTogglMe()
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
    fetchTodoistAndTogglInfo();
   },[])
   useEffect(() => {
    if(readyTogglMe) {
      getTogglProjects(togglMe.default_workspace_id)
      getTogglTimeEntries()
      setReadyTogglMe(false)
      setReadyAllToggl(true)
    }
   },[readyTogglMe])
   useEffect(() => {
    if(readyAllToggl && readyTodoist && readyTogglProjects && readyTogglTimeEntries) {
      setData({todoist: todoistData, toggl: {togglMe: togglMe, togglProjects: togglProjects, togglTimeEntries: togglTimeEntries}})
      setReadyAllToggl(false)
    }
   },[readyAllToggl, readyTodoist, readyTogglProjects, readyTogglTimeEntries])


  return (
     <Router>
       {togglMe ? console.log("TOGGL ME:", togglMe) : <></>}
       {togglProjects ? console.log("TOGGL PROJECTS:", togglProjects) : <></>}
       {togglTimeEntries ? console.log("TOGGL TE:", togglTimeEntries) : <></>}
       {data ? console.log("Data in APP:", data) : <></>}
      <div className="bg-[#412a4c] w-full h-full mx-auto max-w-[100%] text-white">
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

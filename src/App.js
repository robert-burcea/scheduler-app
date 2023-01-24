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

function App() {
  //data and setData are the subscriptions to the Global Context
  const data = useData();
  const setData = useSetData();
  const [togglApiKey, setTogglApiKey] = useState('');
  const [todoistApiKey, setTodoistApiKey] = useState('');
  const [apisReady, setApisReady] = useState(false);
  //dbData is the data fetched from firebase
  const [dbData, setDbData] = useState({})
  const [compoundedProjectsAndTasks, setCompoundedProjectsAndTasks] = useState([])
  const [togglData, setTogglData] = useState();
  const [todoistData, setTodoistData] = useState();
  const [fetchingReady, setFetchingReady] = useState(false)
    //if the TODOIST AND TOGGL DATA WAS FETCHED, ready triggers the FIREBASE UPDATE WITH THE DATA


    const getApis = () => {
    let togglApiKey = prompt("Insert Toggl API:")
    let todoistApiKey = prompt("Insert Todoist API:")
    setTogglApiKey(togglApiKey)
    setTodoistApiKey(todoistApiKey)
    console.log(todoistApiKey, togglApiKey)
    setApisReady(true)
  }

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

  const fetchAllData = () => {
    var togglMe = {};
    var togglProjects = {};
    var togglTimeEntries = {};
    var toggl = {};
    fetch('https://api.track.toggl.com/api/v9/me', {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Authorization": `Basic ${btoa(`${togglApiKey}:api_token`)}`,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        }
    })
    .then((response) => response.json())
    .then((data) => {
        togglMe = data;
        console.log(data);
        fetch(`https://api.track.toggl.com/api/v9/workspaces/${togglMe.default_workspace_id}/projects`, {
          method: 'GET',
          mode: 'cors',
          headers: {
              "Authorization": `Basic ${btoa(`${togglApiKey}:api_token`)}`,
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
          }
        })
        .then((response) => response.json())
        .then((data) => {
            togglProjects = data;
            console.log(data);
            fetch(`https://api.track.toggl.com/api/v9/me/time_entries`, {
              method: 'GET',
              mode: 'cors',
              headers: {
                  "Authorization": `Basic ${btoa(`${togglApiKey}:api_token`)}`,
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
              }
            })
            .then((response) => response.json())
            .then((data) => {
                 togglTimeEntries = data;
                 console.log(data);
                 toggl = ({toggl:{togglMe: togglMe, togglProjects: togglProjects, togglTimeEntries: togglTimeEntries}});
            })
         })
    })

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
      return newProjects;
  }

  var todoistData = [];
  let todoistApi = new TodoistApi(todoistApiKey)
  //fetches TODOIST projects
  todoistApi.getProjects()
  .then((projects) => {
      //fetches TODOIST tasks
      todoistApi.getTasks()
      .then((tasks) => {
          todoistData = combineTodoistData(projects,tasks);
      })
  })
  .catch((error) => console.log(error))

  setTodoistData(todoistData)
  setTogglData(togglData)
  setFetchingReady(true)

}

  const fetchTodoistAndTogglInfo = () => {
    fetchAllData()
  }

  /* **************************************** */

  //compounds projects that E both in todoist and toggl, and gets the corresponding tasks from todoist
  const compoundedProjectsAndTasksCreator = () => {
    var compoundedProjectsAndTasks = []; //will store the projects and corresponding tasks
    //cycles through every toggl Project after first sorting them Asc by hours spend (first is project with 0 hours)
    togglData?.togglProjects?.sort((a,b) => a.actual_hours-b.actual_hours).map((togglProject) => {
      let todoistTasksMatchingTogglProject = [];
      //cycles through todoist projects and checks if it matches the name with the toggl project, if it does, it saves the tasks and the name of project
      //in compoundedProjectsAndTasks
      todoistData?.forEach((todoistProject) => {
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
      if(project.actual_hours < leastWorkedProject.actual_hours)
        leastWorkedProject = project;
    })  
    return leastWorkedProject;
  }
// FETCHING AND USE STATES *******************************************8

  //fetches data from toggl and todoist one time when app starts
  useEffect(() => {
    getApis();
   },[])
    useEffect(() => {
    fetchTodoistAndTogglInfo();
   },[apisReady])
   useEffect(() => {
    if(fetchingReady) {
      setData({todoist: todoistData, toggl: {...togglData.toggl}})
    }
   },[fetchingReady])

   
  return (
     <Router>
      {console.log("DATA in component:", data)}
      <div className="bg-[#412a4c] w-full h-full mx-auto max-w-[100%] text-white">
        <div className=""><Navbar /></div>
        <Routes>
          <Route path="/" element={fetchingReady ? <Home /> : <>Loading...</>} />
          <Route path="/toggl" element={<Toggl />} />
          <Route path="/todoist" element={<Todoist />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

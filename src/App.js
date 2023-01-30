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
import { signInWithGoogle } from './firebase';
import GoogleAuth from './components/GoogleAuth';

function App() {
  //data and setData are the subscriptions to the Global Context
  const data = useData();
  const setData = useSetData();
  const [togglApiKey, setTogglApiKey] = useState('');
  const [todoistApiKey, setTodoistApiKey] = useState('');
  const [apisReady, setApisReady] = useState(false);
  const [dataSet, setDataSet] = useState(false);
  const [allReady, setAllReady] = useState(false);
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
    fetch(`http://localhost:5000/api/todoist/`, {
      headers: {
        'Authorization':`${todoistApiKey}`
      }
    })
    .then((response) => response.json())
    .then((todoistData) => {
      fetch(`http://localhost:5000/api/toggl/`, {
        headers: {
          'Authorization':`${togglApiKey}`
        }
      })
      .then((response) => response.json())
      .then((togglData) => {
        setTodoistData(todoistData)
        setTogglData(togglData)
        setFetchingReady(true)
      })
    })
  }

  const fetchTodoistAndTogglInfo = () => {
    fetchAllData()
  }

  /* **************************************** */

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

  const calculateTimeEntriesForPast6Days = () => {
    const projectDurations = {};
    var toggl = togglData.toggl;
    var togglProjects = toggl?.togglProjects;
    var togglTimeEntries = toggl?.togglTimeEntries;

    togglProjects?.forEach((project) => {
     projectDurations[project.id] = 0;
    });

    togglTimeEntries?.forEach((timeEntry) => {
      projectDurations[timeEntry.project_id] += timeEntry.duration;
    });

    togglProjects?.forEach((project) => {
      project.calculatedDuration = projectDurations[project.id];
    });

    toggl.togglProjects = togglProjects;
    setTogglData(toggl);
    console.log(toggl);
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
      calculateTimeEntriesForPast6Days()
      setData({todoist: todoistData, toggl: {...togglData.toggl}})
      setDataSet(true)
    }
   },[fetchingReady])
   useEffect(() => {
      const compoundedProjectsAndTasks = compoundedProjectsAndTasksCreator();
      console.log("Compounded:", compoundedProjectsAndTasks)
      const leastWorkedProject = getLeastWorkedProject(compoundedProjectsAndTasks);
      setData({...data, leastWorkedProject: leastWorkedProject})
      setAllReady(true);
   },[dataSet])

   
  return (
     <Router>
      {console.log("DATA in component:", data)}
      <div className="bg-[#412a4c] w-full h-full mx-auto max-w-[100%] text-white">
        <div className=""><Navbar /></div>
        <Routes>
          <Route path="/" element={<GoogleAuth />} />
          <Route path="/toggl" element={<Toggl />} />
          <Route path="/todoist" element={<Todoist />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

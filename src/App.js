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

const togglApiKey = '77102011f8bf9ad5b1edf9f7df4fcaae'
const api = new TodoistApi('7f66b2bae0474b388209dce9c4a16a6578fc8e6b')

function App() {
  //data and setData are the subscriptions to the Global Context
  const data = useData();
  const setData = useSetData();
  //dbData is the data fetched from firebase
  const [dbData, setDbData] = useState({})
  const [projects, setProjects] = useState();
  const [tasks, setTasks] = useState();
  //if the TODOIST AND TOGGL DATA WAS FETCHED, ready triggers the FIREBASE UPDATE WITH THE DATA
  const [ready, setReady] = useState(false);

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
    updateDoc(doc(db, "users", "robert"), {
      data:{...data}
    }).then(console.log("Doc set!"))
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
    setReady(true)
}

  /* ************TOGGL FUNCTIONS************* */


  /* **************************************** */

  //fetches data from firebase and todoist one time when app starts
  useEffect(() => {
    getTodoistData();
    firebaseDataFetch();
  },[])
  //sets the firebase data into the global context
  useEffect(() => { 
    setData(dbData)
  },[dbData])
  useEffect(() => { 
    firebaseUpdateData();
    setReady(false);
  },[ready])

  return (
    <Router>
      <div className="App">
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

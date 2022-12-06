import React, { useEffect, useState } from 'react'
import { TodoistApi } from "@doist/todoist-api-typescript"

const api = new TodoistApi('7f66b2bae0474b388209dce9c4a16a6578fc8e6b')

const Todoist = () => {

    const [projects, setProjects] = useState();
    const [tasks, setTasks] = useState();

    //fetches the data from TODOIST
    const getTodoistData = () => {
        //fetches TODOIST projects
        api.getProjects()
    .then((projects) => {setProjects(projects); console.log(projects)})
    .catch((error) => console.log(error))
        //fetches TODOIST tasks
        api.getTasks()
    .then((tasks) => {setTasks(tasks); console.log(tasks)})
    .catch((error) => console.log(error))
    }

    const refreshTodoist = () => {
        getTodoistData()
    }

    const combineTodoistData = () => {
        //creates empty array that will be the modified projects 
        //where each project will have an obj 'tasks' (the tasks corresponding to the project)
        let newProjects = [];
        //cicles through every project in search of tasks that belong to the current project
        for(let i = 0; i < projects?.length; i++) {
            //creates empty array to store found tasks
            let project = projects[i];
            console.log("Project", project)
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
        console.log(newProjects);
    }

    //first time the app loads, it fetches the todoist data        
    useEffect(() => {
        getTodoistData();
    },[])

    return (
    <div>
        {projects && tasks ? combineTodoistData() : <></>}
        {projects ? projects?.map((p) => {
        return <div>
            <h1 className="text-xl">{p.name}</h1>
            {tasks?.map((t) => {
                if(t.projectId === p.id)
                    return <h2 className="mx-3">{t.content}</h2>
                else
                    return <></>
            })}
            </div>
        }) : <></>}
    </div>
  )
}

export default Todoist
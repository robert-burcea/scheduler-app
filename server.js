const express = require('express')
const app = express()
const axios = require('axios')
const bodyParser = require('body-parser');
const cors = require('cors');
const todoist = require('@doist/todoist-api-typescript');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    next()
})
app.use(cors());
app.use(bodyParser.json());

app.get('/api/toggl', (req, res) => {
    var togglMe = {};
    var togglProjects = {};
    var togglTimeEntries = {};
    const togglApiKey = req.headers.authorization;
    fetch('https://api.track.toggl.com/api/v9/me', {
        headers: {
            "Authorization": `Basic ${Buffer.from(`${togglApiKey}:api_token`).toString('base64')}`
        }
    })
    .then((response) => response.json())
    .then((data) => {
        togglMe = data;
        console.log(data);
        fetch(`https://api.track.toggl.com/api/v9/workspaces/${togglMe.default_workspace_id}/projects`, {
            headers: {
              "Authorization": `Basic ${Buffer.from(`${togglApiKey}:api_token`).toString('base64')}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            togglProjects = data;
            console.log(data);
            fetch(`https://api.track.toggl.com/api/v9/me/time_entries`, {
                headers: {
                 "Authorization": `Basic ${Buffer.from(`${togglApiKey}:api_token`).toString('base64')}`
                }
            })
            .then((response) => response.json())
            .then((data) => {
                 togglTimeEntries = data;
                 console.log(data);
                 res.send({toggl:{togglMe: togglMe, togglProjects: togglProjects, togglTimeEntries: togglTimeEntries}});
            })
         })
    })
});

app.get('/api/todoist', (req,res) => {
    const todoistApiKey = req.headers.authorization;
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
    let todoistApi = new todoist.TodoistApi(todoistApiKey)
    //fetches TODOIST projects
    todoistApi.getProjects()
    .then((projects) => {
        //fetches TODOIST tasks
        todoistApi.getTasks()
        .then((tasks) => {
            todoistData = combineTodoistData(projects,tasks);
            res.json(todoistData)
        })
    })
    .catch((error) => console.log(error))
})

app.listen(5000, () => {
    console.log(`Server running on port 5000`)
})
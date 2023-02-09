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
            var day21DaysAgo = new Date();
            day21DaysAgo.setDate(day21DaysAgo.getDate() - 6);
            var start_date = day21DaysAgo.toISOString().substr(0, 10);
            var now = new Date();
            //activate below line to get time entries from today also, however, if a time entry is currently active, issues will arise
            //now.setDate(now.getDate() + 1)
            var end_date = now.toISOString().substr(0, 10);
            togglProjects = data;
            console.log(data);
            fetch(`https://api.track.toggl.com/api/v9/me/time_entries?start_date=${start_date}&end_date=${end_date}`, {
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
    var todoistData = {};
    let todoistApi = new todoist.TodoistApi(todoistApiKey)
    //fetches TODOIST projects
    todoistApi.getProjects()
    .then((projects) => {
        //fetches TODOIST tasks
        todoistApi.getTasks()
        .then((tasks) => {
            todoistData = {projects:[...projects], tasks:[...tasks]};
            res.json(todoistData)
        })
    })
    .catch((error) => console.log(error))
})

app.listen(5000, () => {
    console.log(`Server running on port 5000`)
})
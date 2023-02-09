/* eslint-disable max-len */
const functions = require("firebase-functions");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const todoist = require("@doist/todoist-api-typescript");
const fetch = require("node-fetch");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(cors());
app.use(bodyParser.json());

app.get("/api/toggl", (req, res) => {
  let togglMe = {};
  let togglProjects = {};
  let togglTimeEntries = {};
  const togglApiKey = req.headers.authorization;
  fetch("https://api.track.toggl.com/api/v9/me", {
    headers: {
      "Authorization": `Basic ${Buffer.from(`${togglApiKey}:api_token`).toString("base64")}`,
    },
  })
      .then((response) => response.json())
      .then((data) => {
        togglMe = data;
        console.log(data);
        fetch(`https://api.track.toggl.com/api/v9/workspaces/${togglMe.default_workspace_id}/projects`, {
          headers: {
            "Authorization": `Basic ${Buffer.from(`${togglApiKey}:api_token`).toString("base64")}`,
          },
        })
            .then((response) => response.json())
            .then((data) => {
              const day21DaysAgo = new Date();
              day21DaysAgo.setDate(day21DaysAgo.getDate() - 6);
              const startDate = day21DaysAgo.toISOString().substr(0, 10);
              const now = new Date();
              // activate below line to get time entries from today also, however, if a time entry is currently active, issues will arise
              // now.setDate(now.getDate() + 1)
              const endDate = now.toISOString().substr(0, 10);
              togglProjects = data;
              console.log(data);
              fetch(`https://api.track.toggl.com/api/v9/me/time_entries?start_date=${startDate}&end_date=${endDate}`, {
                headers: {
                  "Authorization": `Basic ${Buffer.from(`${togglApiKey}:api_token`).toString("base64")}`,
                },
              })
                  .then((response) => response.json())
                  .then((data) => {
                    togglTimeEntries = data;
                    console.log(data);
                    res.json({toggl: {togglMe: togglMe, togglProjects: togglProjects, togglTimeEntries: togglTimeEntries}});
                  });
            });
      });
});

app.get("/api/todoist", (req, res) => {
  const todoistApiKey = req.headers.authorization;
  let todoistData = [];
  const todoistApi = new todoist.TodoistApi(todoistApiKey);
  // fetches TODOIST projects
  todoistApi.getProjects()
      .then((projects) => {
        // fetches TODOIST tasks
        todoistApi.getTasks()
            .then((tasks) => {
              todoistData = {projects: [...projects], tasks: [...tasks]};
              res.json(todoistData);
            });
      })
      .catch((error) => console.log(error));
});

exports.app = functions.https.onRequest(app);

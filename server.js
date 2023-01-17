const express = require('express')
const app = express()
const axios = require('axios')

const togglApiKey = '77102011f8bf9ad5b1edf9f7df4fcaae'

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    next()
})

app.get('/toggl/me', (req, res) => {
    axios.get('https://api.track.toggl.com/api/v9/me', {
        headers: {
            "Authorization": `Basic ${Buffer.from(`${togglApiKey}:api_token`).toString('base64')}`
        }
    }).then((response) => {
        res.json(response.data);
    }).catch((error) => {
        res.status(500).json({error});
    });
});

app.get('/toggl/projects/:default_workspace_id', (req, res) => {
    const {default_workspace_id} = req.params
    try {
        axios.get(`https://api.track.toggl.com/api/v9/workspaces/${default_workspace_id}/projects`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Basic ${Buffer.from(`${togglApiKey}:api_token`).toString('base64')}`
            }
        }).then((response) => {
            res.json(response.data)
        }).catch((error) => {
            res.status(500).json({error});
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err});
    }
});

app.get('/toggl/timeEntries', (req, res) => {
  axios.get('https://api.track.toggl.com/api/v9/me/time_entries', {
      headers: {
          "Authorization": `Basic ${Buffer.from(`${togglApiKey}:api_token`).toString('base64')}`
      }
  }).then((response) => {
      res.json(response.data);
  }).catch((error) => {
      res.status(500).json({error});
  });
});

app.listen(5000, () => {
    console.log(`Server running on port 5000`)
})
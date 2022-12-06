import React from 'react';
import Todoist from "./Todoist";
import {Toggl} from "./Toggl";

const togglApiKey = '77102011f8bf9ad5b1edf9f7df4fcaae'

function App() {
  return (
    <div className="App">
      {console.log(Toggl(togglApiKey))}
      <Todoist />
    </div>
  );
}

export default App;

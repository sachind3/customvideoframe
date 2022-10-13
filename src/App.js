import React, { useState } from "react";
import Cam from "./Cam";

const App = () => {
  const [recordStart, setRecordStart] = useState(false);
  return (
    <div>
      <h1>Recording & Live Preview</h1>
      <button
        onClick={() => {
          setRecordStart(true);
        }}
      >
        Start setup
      </button>
      <button
        onClick={() => {
          setRecordStart(false);
        }}
      >
        Stop setup
      </button>
      <div>{recordStart && <Cam />}</div>
    </div>
  );
};

export default App;

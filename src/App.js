import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import CustomAlert from "./components/Alert";

function App() {
  const [jwtToken, setJwtToken] = useState("");

  return (
    <div className="wrapper">
      <Outlet
        context={{
          jwtToken,
          setJwtToken,
        }}
      />
    </div>
  );
}

export default App;

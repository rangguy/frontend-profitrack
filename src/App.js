import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import CustomAlert from "./components/Alert";

function App() {
  const [jwtToken, setJwtToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");

  return (
    <div className="wrapper">
      <CustomAlert message={alertMessage} className={alertClassName} />
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

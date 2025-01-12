import React from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

const ErrorNotFound = () => {
  return (
    <div className="p-d-flex p-flex-column p-ai-center p-jc-center p-mt-5" style={{ textAlign: "center" }}>
      <h1 className="p-text-bold" style={{ fontSize: "4rem", color: "#f44336" }}>404</h1>
      <h2 className="p-mt-3" style={{ fontSize: "2rem" }}>Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">
        <Button label="Go back to Home" icon="pi pi-home" className="p-button-primary p-mt-3" />
      </Link>
    </div>
  );
};

export default ErrorNotFound;

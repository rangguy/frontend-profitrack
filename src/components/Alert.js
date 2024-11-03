import React from "react";

const CustomAlert = (props) => {
  return (
    <div className={`alert ${props.className}`} role="alert">
      {props.message}
    </div>
  );
};

export default CustomAlert;
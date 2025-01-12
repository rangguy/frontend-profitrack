import React, { useState } from "react";

const Input = (props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const inputType =
    props.type === "password" && isPasswordVisible ? "text" : props.type;

  const togglePasswordVisibility = () => {
    if (props.type === "password") {
      setIsPasswordVisible(!isPasswordVisible);
    }
  };

  return (
    <div className="input-group mb-3">
      <input
        type={inputType}
        className={props.className}
        placeholder={props.placeholder}
        onChange={props.onChange}
        id={props.id}
        value={props.value}
        name={props.name}
      />
      {props.type === "password" && (
        <div className="input-group-append">
          <div
            className="input-group-text"
            onClick={togglePasswordVisibility}
            style={{ cursor: "pointer" }}
          >
            <span
              className={isPasswordVisible ? "fas fa-eye-slash" : "fas fa-eye"}
            />
          </div>
        </div>
      )}
      {props.type !== "password" && props.icon && (
        <div className="input-group-append">
          <div className="input-group-text">
            <span className={props.icon} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Input;

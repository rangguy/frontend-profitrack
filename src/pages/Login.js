import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Input from "../components/form/Input";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setJwtToken } = useOutletContext();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    let payload = {
      username: username,
      password: password,
    };

    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    try {
      const response = await axios.post(
        `http://localhost:8080/api/login`,
        payload,
        requestOptions
      );
      const data = response.data;

      if (data.error) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message,
        });
      } else {
        const token = Cookies.get("token");
        if (token) {
          setJwtToken(token);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Login successful!",
          }).then(() => {
            navigate("/");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Token Error",
            text: "Failed to retrieve token.",
          });
        }
      }
    } catch (error) {
      let message = error.message;
      if (error.response) {
        message =
          error.response.data.message || error.response.data.error || message;
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="login-box">
        <div className="login-logo text-center">
          <p>
            <b>Admin</b>Login
          </p>
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Sign in to start your session</p>
            <form onSubmit={handleSubmit}>
              <Input 
                type="text"
                className="form-control"
                placeholder="Username"
                required
                onChange={(event) => setUsername(event.target.value)}
                icon="fas fa-envelope"
              />
              <Input 
                type="password"
                className="form-control"
                placeholder="Password"
                required
                onChange={(event) => setPassword(event.target.value)}
                icon="fas fa-lock"
              />
              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember Me</label>
                  </div>
                </div>
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                </div>
              </div>
            </form>
            <p className="mb-1">
              <a href="/#">I forgot my password</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Input from "../components/form/Input";

const API_BASE_URL = process.env.REACT_APP_API_LOCAL;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { setJwtToken } = useOutletContext();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username wajib diisi";
    }

    if (!password.trim()) {
      newErrors.password = "Password wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

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
        `${API_BASE_URL}/login`,
        payload,
        requestOptions
      );
      const data = response.data;

      if (data.error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Login",
          text: data.message,
        });
      } else {
        const token = Cookies.get("token");
        if (token) {
          setJwtToken(token);
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Berhasil Masuk!",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          navigate("/");
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
            <p className="login-box-msg">Masuk untuk memulai sesi</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Input
                  id="username"
                  type="text"
                  className={`form-control ${
                    errors.username ? "is-invalid" : ""
                  }`}
                  placeholder="Masukkan username"
                  required
                  onChange={(event) => {
                    setUsername(event.target.value);
                    if (errors.username) {
                      setErrors((prev) => ({ ...prev, username: "" }));
                    }
                  }}
                  icon="fas fa-envelope"
                />
                {errors.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Input
                  id="password"
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Masukkan password"
                  required
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }
                  }}
                  icon="fas fa-lock"
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="row mt-3">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Ingat Saya</label>
                  </div>
                </div>
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Masuk
                  </button>
                </div>
              </div>
            </form>
            <p className="mb-1 mt-2">
              <a href="/#">Lupa Password</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

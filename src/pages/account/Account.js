import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import Input from "../../components/form/Input";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_LOCAL;

const Account = (props) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Silakan Login terlebih dahulu.",
      });
      navigate("/login");
      return;
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.Username);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.oldPassword || !formData.newPassword) {
      Swal.fire({
        icon: "error",
        title: "Validasi Error",
        text: "Password lama dan password baru tidak boleh kosong",
      });
      return false;
    }

    if (formData.oldPassword === formData.newPassword) {
      Swal.fire({
        icon: "error",
        title: "Validasi Error",
        text: "Password lama dan password baru tidak boleh sama",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const token = Cookies.get("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Silakan login terlebih dahulu",
      });
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        old_password: formData.oldPassword.trim(),
        new_password: formData.newPassword.trim(),
      };

      await axios.put(`${API_BASE_URL}/user`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Password berhasil diubah",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      setFormData({
        oldPassword: "",
        newPassword: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">{props.title}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">{props.title}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <section className="content px-2">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Informasi Akun</h5>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Ubah Password</h5>
            </div>
            <div className="card-body">
              <form className="form-horizontal" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="oldPassword">Password Lama</label>
                  <Input
                    id="oldPassword"
                    type="password"
                    className="form-control"
                    placeholder="Password Lama"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    icon="fas fa-lock"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Password Baru</label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="form-control"
                    placeholder="Password Baru"
                    value={formData.newPassword}
                    onChange={handleChange}
                    icon="fas fa-lock"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-danger mt-3"
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Ubah Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Account;

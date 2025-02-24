import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import Input from "../../components/form/Input";

const API_BASE_URL = "http://localhost:8080/api";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.Username);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

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
        title: "Berhasil",
        text: "Password berhasil diubah",
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
              <h1 className="m-0">Profil</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">Profil</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <section className="content px-4">
        <div className="container-fluid">
          <form className="form-horizontal" onSubmit={handleSubmit}>
            <div className="form-group row mb-4">
              <label htmlFor="username" className="col-sm-2 col-form-label">
                Username
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  readOnly
                />
              </div>
            </div>

            <div className="form-group row mb-3">
              <label htmlFor="oldPassword" className="col-sm-2 col-form-label">
                Password Lama
              </label>
              <div className="col-sm-10">
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
            </div>

            <div className="form-group row mb-3">
              <label htmlFor="newPassword" className="col-sm-2 col-form-label">
                Password Baru
              </label>
              <div className="col-sm-10">
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
            </div>

            <div className="form-group row mt-4">
              <div className="offset-sm-2 col-sm-10">
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Ubah Password"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Profile;

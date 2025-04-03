import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

const SideNav = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getUserFromToken = () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setUsername(decoded.Username);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setUsername("User");
      }
    };

    getUserFromToken();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      const result = await Swal.fire({
        title: "Konfirmasi Keluar Aplikasi",
        text: "Apakah anda yakin untuk keluar aplikasi?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Keluar Aplikasi!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        try {
          await axios.get(`http://localhost:8080/api/logout`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          Cookies.remove("token");
          localStorage.removeItem("token");

          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Berhasil keluar aplikasi",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          navigate("/login");
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Terjadi kesalahan dalam memproses permintaan logout.",
          });
          console.error("Logout error:", error);
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Terjadi kesalahan dalam memproses konfirmasi.",
      });
      console.error("Confirmation dialog error:", error);
    }
  };

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="/" className="brand-link">
          <img
            src="/dist/img/AdminLTELogo.png"
            alt="AdminLTE"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">
            SPK - SMART & MOORA
          </span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="/dist/img/user2-160x160.jpg"
                className="img-circle elevation-2"
                alt="User"
              />
            </div>
            <div className="info">
              <Link to="/profile" className="d-block">
                {username}
              </Link>
            </div>
          </div>
          {/* SidebarSearch Form */}
          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <NavLink
                  to="/#"
                  className="nav-link"
                  activeClassName="active"
                  isActive={(match, location) => {
                    return match || location.pathname.startsWith("/");
                  }}
                >
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li className="nav-header">DATA</li>
              <li className="nav-item">
                <NavLink
                  to="/criterias"
                  className="nav-link"
                  activeClassName="active"
                  isActive={(match, location) => {
                    return match || location.pathname.startsWith("/criterias");
                  }}
                >
                  <i className="nav-icon fas fa-clipboard-list" />
                  <p>Data Kriteria</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/products"
                  className="nav-link"
                  activeClassName="active"
                  isActive={(match, location) => {
                    return match || location.pathname.startsWith("/products");
                  }}
                >
                  <i className="nav-icon fas fa-box" />
                  <p>Data Produk</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/criteria_scores"
                  className="nav-link"
                  activeClassName="active"
                  isActive={(match, location) => {
                    return (
                      match || location.pathname.startsWith("/criteria_scores")
                    );
                  }}
                >
                  <i className="nav-icon fas fa-table" />
                  <p>Data Nilai Kriteria</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/methods"
                  className="nav-link"
                  activeClassName="active"
                  isActive={(match, location) => {
                    return match || location.pathname.startsWith("/methods");
                  }}
                >
                  <i className="nav-icon fas fa-calculator" />{" "}
                  <p>Hasil Perhitungan</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/reports"
                  className="nav-link"
                  activeClassName="active"
                  isActive={(match, location) => {
                    return match || location.pathname.startsWith("/reports");
                  }}
                >
                  <i className="nav-icon fas fa-file-alt" />{" "}
                  <p>Laporan Perhitungan</p>
                </NavLink>
              </li>
              <li className="nav-header">DATA AKUN</li>
              <li className="nav-item">
                <NavLink
                  to="/account"
                  className="nav-link"
                  activeClassName="active"
                  isActive={(match, location) => {
                    return match || location.pathname.startsWith("/account");
                  }}
                >
                  <i className="nav-icon fas fa-user" /> <p>Data Akun</p>
                </NavLink>
              </li>
              <li className="nav-header">AKSI</li>
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="nav-link logout-button bg-red"
                >
                  <i className="nav-icon fas fa-sign-out-alt" />
                  <p>Logout</p>
                </button>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
};

export default SideNav;

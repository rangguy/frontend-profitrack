import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_LOCAL;

const Dashboard = (props) => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    products: 0,
    criteria: 0,
    reports: 0,
    users: 0,
  });

  useEffect(() => {
    const jwtToken = localStorage.getItem("token");

    if (!jwtToken) {
      navigate("/login");
    }

    const fetchCounts = async () => {
      try {
        const [productsRes, criteriaRes, reportsRes, usersRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/products/count`, {
              headers: { Authorization: `Bearer ${jwtToken}` },
              withCredentials: true,
            }),
            axios.get(`${API_BASE_URL}/criterias/count`, {
              headers: { Authorization: `Bearer ${jwtToken}` },
              withCredentials: true,
            }),
            axios.get(`${API_BASE_URL}/reports/count`, {
              headers: { Authorization: `Bearer ${jwtToken}` },
              withCredentials: true,
            }),
            axios.get(`${API_BASE_URL}/user/count`, {
              headers: { Authorization: `Bearer ${jwtToken}` },
              withCredentials: true,
            }),
          ]);

        setCounts({
          products: productsRes.data.count,
          criteria: criteriaRes.data.count,
          reports: reportsRes.data.count,
          users: usersRes.data.count,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [navigate]);

  return (
    <div>
      {/* Content Header */}
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

      {/* Main Content */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* Card 1 - Produk */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card bg-danger text-white h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-uppercase fw-bold mb-1">
                        Jumlah Produk
                      </h6>
                      <h2 className="display-4 mb-0">{counts.products}</h2>
                    </div>
                    <div className="icon text-white">
                      <i className="fas fa-box fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    to="/products"
                    className="text-white text-decoration-none"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2 - Kriteria */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card bg-success text-white h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-uppercase fw-bold mb-1">
                        Jumlah Kriteria
                      </h6>
                      <h2 className="display-4 mb-0">{counts.criteria}</h2>
                    </div>
                    <div className="icon text-white">
                      <i className="fas fa-clipboard-list fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    to="/criterias"
                    className="text-white text-decoration-none"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3 - Laporan */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card bg-primary text-white h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-uppercase fw-bold mb-1">
                        Jumlah Laporan
                      </h6>
                      <h2 className="display-4 mb-0">{counts.reports}</h2>
                    </div>
                    <div className="icon text-white">
                      <i className="fas fa-file-alt fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    to="/reports"
                    className="text-white text-decoration-none"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 4 - Data Akun */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card bg-warning h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center text-white">
                    <div>
                      <h6 className="text-uppercase fw-bold mb-1">Data Akun</h6>
                      <h2 className="display-4 mb-0">{counts.users}</h2>
                    </div>
                    <div className="icon text-white">
                      <i className="fas fa-user fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    to="/account"
                    className="text-white text-decoration-none"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

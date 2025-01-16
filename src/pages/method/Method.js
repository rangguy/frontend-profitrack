import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:8080/api";

const Method = (props) => {
  const [methods, setMethods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${API_BASE_URL}/methods`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMethods(response.data);
      } catch (error) {
        console.error("Error fetching methods:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Terjadi kesalahan dalam memuat metode.",
        });
      }
    };

    fetchMethods();
  }, []);

  const handleMethodClick = (id, name) => {
    navigate(`/methods/${id}/${name}`, { state: { id, name } });
  };
  
  const handleMethodClickTwo = (id, name) => {
    navigate(`/methods/reports/${id}`, { state: { id, name} });
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
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {methods.length > 0 ? (
              methods.map((method) => (
                <div className="col-md-4 mb-4" key={method.id}>
                  <div className="card shadow-sm border-primary">
                    <div className="card-body">
                      <h5 className="card-title mb-2">{method.name}</h5>
                      <p className="card-text">
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            handleMethodClick(method.id, method.name)
                          }
                        >
                          Lihat Hasil Perhitungan
                        </button>
                        <button
                          className="btn btn-success mx-2"
                          onClick={() =>
                            handleMethodClickTwo(method.id, method.name)
                          }
                        >
                          Lihat Laporan
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-warning" role="alert">
                  Tidak ada metode yang tersedia.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Method;

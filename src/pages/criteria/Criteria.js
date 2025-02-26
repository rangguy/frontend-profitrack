import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/api";

const Category = (props) => {
  const [criterias, setCriterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCriterias = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/criterias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCriterias(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        navigate("/login");
      } else {
        console.error("Error fetching criterias:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCriterias();
  }, [fetchCriterias]);

  const handleEdit = (criteriaId) => {
    navigate(`/criterias/${criteriaId}`);
  };


  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <button
          onClick={() => handleEdit(rowData.id)}
          className="btn btn-primary btn-sm d-flex align-items-center"
          title="Ubah"
        >
          <i className="fas fa-edit"></i>
          <span>Ubah</span>
        </button>
      </div>
    );
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
          {/* Add Button */}
          <Link to="/criterias/add" className="btn btn-success mb-3">
            <i className="fas fa-plus me-2 mx-1"></i>
            Tambah Kriteria
          </Link>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <DataTable
            value={criterias}
            stripedRows
            rowHover
            paginator
            rows={10}
            loading={loading}
            emptyMessage="Data Kriteria masih kosong"
          >
            <Column field="name" header="Nama" sortable />
            <Column field="weight" header="Bobot" sortable />
            <Column field="type" header="Tipe" sortable />
            <Column
              field="action"
              header="Action"
              body={actionBodyTemplate}
              style={{ textAlign: "center", width: "180px" }}
            />
          </DataTable>
        </div>
      </section>
    </div>
  );
};

export default Category;

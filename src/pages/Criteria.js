import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import axios from "axios";

const Category = (props) => {
  const [criterias, setCriterias] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCriterias = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get("http://localhost:8080/api/criterias", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCriterias(response.data);
    } catch (error) {
      console.error("Error fetching criterias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriterias();
  }, []);

  // Action button functions
  const handleAdd = () => {
    console.log("Add criteria");
    navigator("/add/criteria");
  };

  const handleEdit = (criteria) => {
    console.log("Edit criteria", criteria);
    // Edit product logic here
  };

  const handleDelete = async (criteriaId) => {
    const token = Cookies.get("token");
    try {
      await axios.delete(`http://localhost:8080/api/criterias/${criteriaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCriterias(
        criterias.filter((criteria) => criteria.id !== criteriaId)
      );
      console.log("Criteria deleted successfully");
    } catch (error) {
      console.error("Error deleting criteria:", error);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <button
          onClick={() => handleEdit(rowData)}
          className="btn btn-primary btn-sm mr-2"
        >
          Ubah
        </button>
        <button
          onClick={() => handleDelete(rowData.id)}
          className="btn btn-danger btn-sm"
        >
          Hapus
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
          <button onClick={handleAdd} className="btn btn-success mb-3">
            Tambah Kriteria
          </button>
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
            emptyMessage="No criterias found."
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

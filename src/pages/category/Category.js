import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Category = (props) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get("http://localhost:8080/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        navigate("/login");
      } else {
        console.error("Error fetching categories:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEdit = (categoryId) => {
    navigate(`/categories/${categoryId}`);
  };

  const handleDelete = async (categoryId) => {
    const token = Cookies.get("token");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Please login to continue.",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Konfirmasi Hapus",
        text: "Apakah Anda yakin ingin menghapus kategori ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:8080/api/categories/${categoryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setCategories(
            categories.filter((category) => category.id !== categoryId)
          );

          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Kategori berhasil dihapus",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          let errorMessage = "Terjadi kesalahan saat menghapus kategori.";

          if (error.response) {
            switch (error.response.status) {
              case 403:
                errorMessage =
                  "Anda tidak memiliki izin untuk menghapus kategori ini.";
                break;
              case 404:
                errorMessage = "Kategori tidak ditemukan.";
                break;
              case 409:
                errorMessage =
                  "Kategori tidak dapat dihapus karena masih digunakan.";
                break;
              default:
                errorMessage = error.response.data?.message || errorMessage;
            }
          }

          Swal.fire({
            icon: "error",
            title: "Error!",
            text: errorMessage,
          });

          console.error("Error deleting category:", error);
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Terjadi kesalahan dalam memproses permintaan.",
      });
      console.error("Error in delete handler:", error);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        <button
          onClick={() => handleEdit(rowData.id)}
          className="btn btn-primary btn-sm d-flex align-items-center"
          title="Ubah"
        >
          <i className="fas fa-edit"></i>
          <span>Ubah</span>
        </button>
        <button
          onClick={() => handleDelete(rowData.id)}
          className="btn btn-danger btn-sm d-flex align-items-center"
          title="Hapus"
        >
          <i className="fas fa-trash"></i>
          <span>Hapus</span>
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
          <Link to="/categories/add" className="btn btn-success mb-3">
          <i className="fas fa-plus me-2 mx-1"></i>
            Tambah Kategori
          </Link>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <DataTable
            value={categories}
            stripedRows
            rowHover
            paginator
            rows={10}
            loading={loading}
            emptyMessage="Data Kategori masih kosong"
          >
            <Column field="name" header="Nama" sortable />
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

import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FileUpload } from "primereact/fileupload";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:8080/api";

const Product = (props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        navigate("/login");
      } else {
        console.error("Error fetching products:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleDelete = async (productId) => {
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
        text: "Apakah Anda yakin ingin menghapus produk ini?",
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
            `${API_BASE_URL}/products/${productId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setProducts(products.filter((products) => products.id !== productId));

          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Produk berhasil dihapus",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          let errorMessage = "Terjadi kesalahan saat menghapus Produk.";

          if (error.response) {
            switch (error.response.status) {
              case 403:
                errorMessage =
                  "Anda tidak memiliki izin untuk menghapus produk ini.";
                break;
              case 404:
                errorMessage = "Produk tidak ditemukan.";
                break;
              case 409:
                errorMessage =
                  "Produk tidak dapat dihapus karena masih digunakan.";
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

          console.error("Error deleting product:", error);
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

  const handleExport = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${API_BASE_URL}/products/export`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
      const currentDate = new Date();
      const month = currentDate
        .toLocaleString("id-ID", { month: "long" })
        .toLowerCase();
      const year = currentDate.getFullYear();

      const fileName = `data-produk-${month}-${year}.xlsx`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting products:", error);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (showModal) {
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
       ` ${API_BASE_URL}/products/import`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchProducts();
      toggleModal();
      setFile(null);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;

        Swal.fire({
          icon: "error",
          title: "Import Error",
          text: errorMessage,
        });

        setFile(null);
        toggleModal();
        return;
      }

      console.error("Error importing products:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const currencyBodyTemplate = (rowData, field) => {
    return formatCurrency(rowData[field]);
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

          {/* Button Container */}
          <div className="d-flex flex-wrap mb-2">
            {/* Tombol Tambah Produk */}
            <button
              className="btn btn-success me-2"
              onClick={() => navigate("/products/add")}
            >
              <i className="fas fa-plus me-2 mx-1"></i>
              Tambah Produk
            </button>

            {/* Tombol Export Excel */}
            <button className="btn btn-info mx-2" onClick={handleExport}>
              <i className="fas fa-download me-2 mx-1"></i>
              Download Excel
            </button>

            {/* Tombol Import Excel */}
            <button className="btn btn-warning" onClick={toggleModal}>
              <i className="fas fa-upload me-2 mx-1"></i>
              Upload Excel
            </button>
          </div>

          {/* Modal untuk Upload Excel */}
          {showModal && (
            <div
              className="modal fade show"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
              tabIndex="-1"
              role="dialog"
              aria-labelledby="modalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="modalLabel">
                      Upload File Excel
                    </h5>
                    <button
                      type="button"
                      className="close btn btn-danger"
                      aria-label="Close"
                      onClick={toggleModal}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>
                      Hanya file dengan ekstensi .xlsx atau .xls yang
                      diperbolehkan. Maksimal ukuran file adalah 1MB.
                    </p>
                    <FileUpload
                      mode="basic"
                      name="file"
                      auto
                      accept=".xlsx,.xls"
                      maxFileSize={1000000}
                      onSelect={(event) => setFile(event.files[0])}
                      chooseLabel="Pilih File"
                      className="w-100"
                    />

                    {file && (
                      <div className="mt-3">
                        <p>
                          <strong>Nama File:</strong> {file.name}
                        </p>
                        <p>
                          <strong>Ukuran File:</strong>{" "}
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={toggleModal}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleImport}
                      disabled={!file}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <DataTable
            value={products}
            stripedRows
            rowHover
            paginator
            rows={10}
            loading={loading}
            emptyMessage="Data produk masih kosong"
          >
            <Column field="name" header="Nama Produk" sortable />
            <Column field="category_name" header="Kategori" sortable />
            <Column
              field="purchase_cost"
              header="Harga Beli"
              sortable
              body={(rowData) => currencyBodyTemplate(rowData, "purchase_cost")}
            />
            <Column
              field="price_sale"
              header="Harga Jual"
              sortable
              body={(rowData) => currencyBodyTemplate(rowData, "price_sale")}
            />
            <Column
              field="profit"
              header="Keuntungan"
              sortable
              body={(rowData) => currencyBodyTemplate(rowData, "profit")}
            />
            <Column field="unit" header="Satuan" sortable />
            <Column field="stock" header="Stok" sortable />
            <Column field="sold" header="Stok Terjual" sortable />
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

export default Product;

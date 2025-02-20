import React, { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:8080/api";

const Report = (props) => {
  const { id } = useParams();
  const location = useLocation();
  const { name } = location.state || {};
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [period, setPeriod] = useState("");

  const navigate = useNavigate();

  const fetchReports = async (period) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${API_BASE_URL}/reports/${id}`,
        { period },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setReports(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || "Failed to fetch reports.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedMonth) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please select a month.",
      });
      return;
    }

    const currentYear = new Date().getFullYear();
    const period = `${selectedMonth} ${currentYear}`;
    setPeriod(period);
    fetchReports(period);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const handleExport = async (period) => {
    if (!selectedMonth) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please select a month.",
      });
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${API_BASE_URL}/reports/export/${id}`,
        { period },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const currentDate = new Date();
      const month = currentDate
        .toLocaleString("id-ID", { month: "long" })
        .toLowerCase();
      const year = currentDate.getFullYear();

      const fileName = `laporan-produk-${month}-${year}.xlsx`;

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

  const handleDelete = async () => {
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
        text: "Apakah Anda yakin ingin menghapus laporan ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/reports/${id}`, {
            data: { period },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: `Laporan bulan ${period} berhasil dihapus`,
            showConfirmButton: false,
            timer: 1500,
          });
          fetchReports(period);
        } catch (error) {
          let errorMessage = "Terjadi kesalahan saat menghapus laporan.";

          if (error.response) {
            switch (error.response.status) {
              case 403:
                errorMessage =
                  "Anda tidak memiliki izin untuk menghapus laporan ini.";
                break;
              case 404:
                errorMessage = "laporan tidak ditemukan.";
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

          console.error("Error deleting reports:", error);
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

  return (
    <div>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Laporan untuk {name}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/methods">Metode</Link>
                </li>
                <li className="breadcrumb-item active">
                  {props.title}
                  {name}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <Link className="btn btn-secondary mx-2 mb-2" to="/methods">
            <i className="fas fa-arrow-left mx-1"></i>
            Kembali
          </Link>
          <form onSubmit={handleFormSubmit} className="mb-3 px-2">
            <div className="form-group">
              <label htmlFor="month">Pilih Bulan</label>
              <select
                id="month"
                className="form-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">-- Pilih Bulan --</option>
                <option value="January">Januari</option>
                <option value="February">Februari</option>
                <option value="March">Maret</option>
                <option value="April">April</option>
                <option value="May">Mei</option>
                <option value="June">Juni </option>
                <option value="July">Juli</option>
                <option value="August">Agustus</option>
                <option value="September">September</option>
                <option value="October">Oktober</option>
                <option value="November">November</option>
                <option value="December">Desember</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-eye mx-1"></i>
              Tampilkan Laporan
            </button>
            <button
              className="btn btn-info mx-2"
              onClick={() => handleExport(period)}
            >
              <i className="fas fa-download mx-1"></i>
              Download Excel
            </button>
            <button className="btn btn-danger mx-2" onClick={handleDelete}>
              <i className="fas fa-trash mx-1"></i>
              Hapus Laporan {period}
            </button>
          </form>

          <DataTable
            value={reports}
            stripedRows
            rowHover
            paginator
            rows={10}
            loading={loading}
            emptyMessage="Data laporan masih kosong"
          >
            <Column
              header="Rank"
              body={(rowData, { rowIndex }) => rowIndex + 1}
              sortable
            />
            <Column field="product.name" header="Nama Produk" sortable />
            <Column field="final_score" header="Skor Akhir" sortable />

            {/* Product Details */}
            <Column
              field="product.purchase_cost"
              header="Harga Beli"
              sortable
              body={(rowData) => formatCurrency(rowData.product.purchase_cost)}
            />
            <Column
              field="product.price_sale"
              header="Harga Jual"
              sortable
              body={(rowData) => formatCurrency(rowData.product.price_sale)}
            />
            <Column
              field="product.profit"
              header="Keuntungan"
              sortable
              body={(rowData) => formatCurrency(rowData.product.profit)}
            />
            <Column field="product.unit" header="Satuan" sortable />
            <Column field="product.stock" header="Stok" sortable />
            <Column field="product.sold" header="Stok Terjual" sortable />

          </DataTable>
        </div>
      </section>
    </div>
  );
};

export default Report;

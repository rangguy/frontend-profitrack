import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.REACT_APP_API_LOCAL;

const Report = (props) => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const reportsWithMethodNames = await Promise.all(
        response.data.map(async (report) => {
          const methodName = await fetchMethodName(report.method_id);
          return { ...report, method_name: methodName };
        })
      );
      setReports(reportsWithMethodNames);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "Silakan Login terlebih dahulu.",
        });
        navigate("/login");
        return;
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const fetchMethodName = async (methodId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/methods/${methodId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.name;
    } catch (error) {
      console.error("Failed to fetch method name:", error);
      return "Unknown Method";
    }
  };

  const handleViewReport = (reportId, methodName, reportCode) => {
    navigate(`/reports/detail-reports/${reportId}/${methodName}/${reportCode}`);
  };

  const handleDeleteReport = async (reportId) => {
    const token = localStorage.getItem("token");

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
          await axios.delete(`${API_BASE_URL}/reports/${reportId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setReports(reports.filter((reports) => reports.id !== reportId));

          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Laporan berhasil dihapus",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        } catch (error) {
          let errorMessage = "Terjadi kesalahan saat menghapus Laporan.";

          if (error.response) {
            switch (error.response.status) {
              case 403:
                errorMessage =
                  "Anda tidak memiliki izin untuk menghapus Laporan ini.";
                break;
              case 404:
                errorMessage = "Laporan tidak ditemukan.";
                break;
              case 409:
                errorMessage =
                  "Laporan tidak dapat dihapus karena masih digunakan.";
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

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date
      .toLocaleString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(",", " -");
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        <button
          onClick={() =>
            handleViewReport(
              rowData.id,
              rowData.method_name,
              rowData.report_code
            )
          }
          className="btn btn-primary btn-sm d-flex align-items-center"
          title="Lihat"
        >
          <i className="fas fa-eye"></i>
          <span>Lihat</span>
        </button>
        <button
          onClick={() => handleDeleteReport(rowData.id)}
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
              <h1 className="m-0">Daftar {props.title}</h1>
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
          <DataTable
            value={reports}
            loading={loading}
            paginator
            rows={5}
            emptyMessage="Data Laporan masih kosong"
          >
            <Column field="method_name" header="Nama Metode" sortable></Column>
            <Column field="report_code" header="Kode Laporan" sortable></Column>
            <Column field="total_data" header="Total Data" sortable></Column>
            <Column
              field="created_at"
              header="Dibuat Pada"
              sortable
              body={(rowData) => formatDate(rowData.created_at)}
            />

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

export default Report;

import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.REACT_APP_API_LOCAL;

const CriteriaScore = (props) => {
  const [criteriaScores, setCriteriaScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [criteriaNames, setCriteriaNames] = useState({});
  const [productNames, setProductNames] = useState({});
  const navigate = useNavigate();

  // Fetch all criteria names
  const fetchCriteriaNames = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/criterias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const criteriaMap = response.data.reduce((acc, curr) => {
        acc[curr.id] = curr.name;
        return acc;
      }, {});
      setCriteriaNames(criteriaMap);
    } catch (error) {
      console.error("Error fetching criteria names:", error);
    }
  }, []);

  // Fetch all product names
  const fetchProductNames = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productMap = response.data.reduce((acc, curr) => {
        acc[curr.id] = curr.name;
        return acc;
      }, {});
      setProductNames(productMap);
    } catch (error) {
      console.error("Error fetching product names:", error);
    }
  }, []);

  // Fetch criteria scores
  const fetchCriteriaScores = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/criteria_scores`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCriteriaScores(Array.isArray(response.data) ? response.data : []);
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
      } else {
        console.error("Error fetching criteria scores:", error);
      }
    }
  }, [navigate]);

  const handlePerhitungan = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");

      const response = await axios.post(
        `${API_BASE_URL}/criteria_scores`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Nilai Kriteria berhasil dihitung",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      fetchCriteriaScores();
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat menghitung nilai kriteria.";

      if (error.response) {
        switch (error.response.status) {
          case 403:
            errorMessage =
              "Anda tidak memiliki izin untuk menghitung nilai kriteria ini.";
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

      console.error("Error counting criteria scores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePerhitungan = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");

      const response = await axios.put(
        `${API_BASE_URL}/criteria_scores`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Update Nilai Kriteria berhasil dihitung",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      fetchCriteriaScores();
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat menghitung nilai kriteria.";

      if (error.response) {
        switch (error.response.status) {
          case 403:
            errorMessage =
              "Anda tidak memiliki izin untuk menghitung nilai kriteria ini.";
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

      console.error("Error counting criteria scores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (criteriaScoreId) => {
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
        text: "Apakah Anda yakin ingin menghapus nilai kriteria ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `${API_BASE_URL}/criteria_scores/${criteriaScoreId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCriteriaScores(
          criteriaScores.filter((score) => score.id !== criteriaScoreId)
        );

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Nilai kriteria berhasil dihapus",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchCriteriaScores();
      }
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat menghapus nilai kriteria.";

      if (error.response) {
        switch (error.response.status) {
          case 403:
            errorMessage =
              "Anda tidak memiliki izin untuk menghapus nilai kriteria ini.";
            break;
          case 404:
            errorMessage = "Nilai kriteria tidak ditemukan.";
            break;
          case 409:
            errorMessage =
              "Nilai kriteria tidak dapat dihapus karena masih digunakan.";
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

      console.error("Error deleting criteria scores:", error);
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchCriteriaNames();
      await fetchProductNames();
      await fetchCriteriaScores();
      setLoading(false);
    };

    initializeData();
  }, [fetchCriteriaNames, fetchProductNames, fetchCriteriaScores]);

  // Transform scores into a format suitable for the DataTable
  const transformScores = () => {
    const transformedData = {};
    const criteriaSet = new Set();

    // Organize scores by product and collect criteria
    criteriaScores.forEach((score) => {
      const { product_id, criteria_id, score: scoreValue } = score;

      if (!transformedData[product_id]) {
        transformedData[product_id] = {
          id: product_id,
          name: productNames[product_id] || `Product ${product_id}`,
        };
      }

      const formatNumber = (num) => num.toFixed(9).replace(/(\.0+|0+)$/, "");

      transformedData[product_id][`criteria_${criteria_id}`] = formatNumber(scoreValue);
      criteriaSet.add(criteria_id);
    });

    // Convert the transformed data into an array
    const finalData = Object.values(transformedData);
    return { finalData, criteria: Array.from(criteriaSet) };
  };

  const { finalData, criteria } = transformScores();

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
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
          <div className="d-flex flex-wrap mb-2">
            <button
              className="btn btn-success me-2"
              onClick={handlePerhitungan}
            >
              <i className="fas fa-calculator me-2 mx-1"></i>
              Hitung Nilai Kriteria
            </button>

            <button
              className="btn btn-info mx-2"
              onClick={handleUpdatePerhitungan}
            >
              <i className="fas fa-calculator me-2 mx-1"></i>
              Update Nilai Kriteria
            </button>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <DataTable
            value={finalData}
            stripedRows
            rowHover
            paginator
            rows={10}
            loading={loading}
            emptyMessage="Data Nilai Kriteria masih kosong"
          >
            <Column field="name" header="Nama Produk" sortable />
            {criteria.map((criteriaId) => (
              <Column
                key={criteriaId}
                field={`criteria_${criteriaId}`}
                header={criteriaNames[criteriaId] || `Criteria ${criteriaId}`}
                sortable
              />
            ))}
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

export default CriteriaScore;

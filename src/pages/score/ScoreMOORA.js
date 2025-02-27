import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:8080/api";

const ScoreMOORA = (props) => {
  const [scores, setScores] = useState([]);
  const [finalScores, setFinalScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [criteriaNames, setCriteriaNames] = useState({});
  const [productNames, setProductNames] = useState({});
  const { id } = useParams();
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

  // Fetch scores
  const fetchScores = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/scores/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setScores(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        navigate("/login");
      } else {
        console.error("Error fetching scores MOORA:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, id]);

  // Fetch final scores
  const fetchFinalScores = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_BASE_URL}/final_scores/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFinalScores(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        navigate("/login");
      } else {
        console.error("Error fetching final scores:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, id]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchCriteriaNames();
      await fetchProductNames();
      await fetchScores();
      await fetchFinalScores();
      setLoading(false);
    };

    initializeData();
  }, [fetchCriteriaNames, fetchProductNames, fetchScores, fetchFinalScores]);

  // Transform scores into a format suitable for the DataTable
  const transformScores = () => {
    const transformedData = {};
    const criteriaSet = new Set();

    scores.forEach((score) => {
      const { product_id, criteria_id, score_one, score_two } = score;

      if (!transformedData[product_id]) {
        transformedData[product_id] = {
          id: product_id,
          name: productNames[product_id] || `Product ${product_id}`,
        };
      }

      transformedData[product_id][`criteria_${criteria_id}_score_one`] =
        score_one;
      transformedData[product_id][`criteria_${criteria_id}_score_two`] =
        score_two;
      criteriaSet.add(criteria_id);
    });

    return {
      finalData: Object.values(transformedData),
      criteria: Array.from(criteriaSet),
    };
  };

  const { finalData, criteria } = transformScores();

  // Transform final scores
  const transformFinalScores = () => {
    const transformedData = {};

    finalScores.forEach((score) => {
      const { product_id, final_score } = score;

      if (!transformedData[product_id]) {
        transformedData[product_id] = {
          id: product_id,
          name: productNames[product_id] || `Product ${product_id}`,
          final_score: parseFloat(final_score),
        };
      }
    });

    return Object.values(transformedData).sort(
      (a, b) => b.final_score - a.final_score
    );
  };

  const finalDataScores = transformFinalScores();

  const handlePerhitunganMOORA = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${API_BASE_URL}/scores/${id}/MOORA`,
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
          text: "Nilai MOORA berhasil dihitung",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      fetchScores();
      fetchFinalScores();
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat menghitung nilai MOORA.";

      if (error.response) {
        switch (error.response.status) {
          case 403:
            errorMessage =
              "Anda tidak memiliki izin untuk menghitung nilai MOORA ini.";
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

      console.error("Error counting scores MOORA:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAndSafeFinalScore = async () => {
    setLoading(true);

    try {
      const result = await Swal.fire({
        title: "Konfirmasi Hapus",
        text: "Apakah Anda yakin ingin menghapus nilai MOORA ini dan memasukkan ke laporan?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (!result.isConfirmed) {
        setLoading(false);
        return;
      }

      const token = Cookies.get("token");

      const response = await axios.post(
        `${API_BASE_URL}/final_scores/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Nilai MOORA berhasil dihapus dan disimpan ke laporan.",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchScores();
        fetchFinalScores();
      }
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat menghapus nilai MOORA.";

      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage =
              error.response.data?.error || "Data tidak ditemukan.";
            break;
          case 403:
            errorMessage =
              "Anda tidak memiliki izin untuk menghapus nilai MOORA ini.";
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

      console.error("Error deleting MOORA scores:", error);
    } finally {
      setLoading(false);
    }
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
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/methods">Metode</Link>
                </li>
                <li className="breadcrumb-item active">{props.title}</li>
              </ol>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <Link className="btn btn-secondary" to="/methods">
                <i className="fas fa-arrow-left me-2 mx-1"></i>
                Kembali
              </Link>
              <button
                className="btn btn-success mx-2"
                onClick={handlePerhitunganMOORA}
              >
                <i className="fas fa-cogs me-2 mx-1"></i>
                Proses Perhitungan MOORA
              </button>
            </div>
            <div>
              <button
                className="btn btn-warning"
                onClick={handleDeleteAndSafeFinalScore}
              >
                <i className="fas fa-save me-2 mx-1"></i>
                Simpan Data Nilai Akhir
              </button>
            </div>
          </div>
        </div>
      </div>
      <section className="content px-3">
        <div className="row">
          <div className="col">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Nilai Normalisasi</h3>
                <div className="card-tools">
                  <button
                    type="button"
                    className="btn btn-tool"
                    data-card-widget="collapse"
                    title="Collapse"
                  >
                    <i className="fas fa-minus" />
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="container-fluid">
                  <DataTable
                    value={finalData}
                    stripedRows
                    rowHover
                    paginator
                    rows={10}
                    loading={loading}
                    emptyMessage="Data Nilai Normalisasi masih kosong"
                  >
                    <Column field="name" header="Nama Produk" sortable />
                    {criteria.map((criteriaId) => (
                      <Column
                        key={criteriaId}
                        field={`criteria_${criteriaId}_score_one`}
                        header={
                          criteriaNames[criteriaId] || `Criteria ${criteriaId}`
                        }
                        sortable
                      />
                    ))}
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="content px-3">
        <div className="row">
          <div className="col">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Nilai Normalisasi x Bobot</h3>
                <div className="card-tools">
                  <button
                    type="button"
                    className="btn btn-tool"
                    data-card-widget="collapse"
                    title="Collapse"
                  >
                    <i className="fas fa-minus" />
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="container-fluid">
                  <DataTable
                    value={finalData}
                    stripedRows
                    rowHover
                    paginator
                    rows={10}
                    loading={loading}
                    emptyMessage="Data Nilai Normalisasi x Bobot masih kosong"
                  >
                    <Column field="name" header="Nama Produk" sortable />
                    {criteria.map((criteriaId) => (
                      <Column
                        key={criteriaId}
                        field={`criteria_${criteriaId}_score_two`}
                        header={
                          criteriaNames[criteriaId] || `Criteria ${criteriaId}`
                        }
                        sortable
                      />
                    ))}
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="content px-3">
        <div className="row">
          <div className="col">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Nilai Akhir MOORA</h3>
                <div className="card-tools">
                  <button
                    type="button"
                    className="btn btn-tool"
                    data-card-widget="collapse"
                    title="Collapse"
                  >
                    <i className="fas fa-minus" />
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="container-fluid">
                  <DataTable
                    value={finalDataScores}
                    stripedRows
                    rowHover
                    paginator
                    rows={10}
                    loading={loading}
                    emptyMessage="Data nilai akhir masih kosong"
                  >
                    <Column
                      header="Rank"
                      body={(rowData, { rowIndex }) => rowIndex + 1}
                      sortable
                    />
                    <Column field="name" header="Nama Produk" sortable />
                    <Column
                      field="final_score"
                      header="Nilai Akhir"
                      sortable
                      body={(rowData) => rowData.final_score}
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScoreMOORA;

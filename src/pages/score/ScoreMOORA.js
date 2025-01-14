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

const ScoreMOORA = (props) => {
  const [scores, setScores] = useState([]);
  const [finalScores, setFinalScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [criteriaNames, setCriteriaNames] = useState({});
  const [productNames, setProductNames] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchScores = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `http://localhost:8080/api/scores/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const fetchFinalScores = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `http://localhost:8080/api/final_scores/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFinalScores(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        navigate("/login");
      } else {
        console.error("Error fetching scores SMART:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, id]);

  const fetchNames = useCallback(async () => {
    const token = Cookies.get("token");
    const criteriaSet = new Set();
    const productSet = new Set();

    scores.forEach((score) => {
      criteriaSet.add(score.criteria_id);
      productSet.add(score.product_id);
    });

    // Fetch criteria names
    const criteriaPromises = Array.from(criteriaSet).map(async (criteriaId) => {
      const response = await axios.get(
        `http://localhost:8080/api/criterias/${criteriaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { id: criteriaId, name: response.data.name };
    });

    // Fetch Nama Produk / Kriterias
    const productPromises = Array.from(productSet).map(async (productId) => {
      const response = await axios.get(
        `http://localhost:8080/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { id: productId, name: response.data.name };
    });

    // Wait for all promises to resolve
    const criteriaResults = await Promise.all(criteriaPromises);
    const productResults = await Promise.all(productPromises);

    // Map results to objects for easy access
    const criteriaMap = criteriaResults.reduce((acc, curr) => {
      acc[curr.id] = curr.name;
      return acc;
    }, {});

    const productMap = productResults.reduce((acc, curr) => {
      acc[curr.id] = curr.name;
      return acc;
    }, {});

    setCriteriaNames(criteriaMap);
    setProductNames(productMap);
  }, [scores]);

  const handlePerhitungan = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");

      // Make the POST request
      const response = await axios.post(
        `http://localhost:8080/api/scores/${id}`,
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
      window.location.reload();
    }
  };

  const handlePerhitunganMOORA = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");

      const response = await axios.put(
        `http://localhost:8080/api/scores/${id}/MOORA`,
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
      window.location.reload();
    }
  };

  useEffect(() => {
    fetchScores();
    fetchFinalScores();
  }, [fetchScores, fetchFinalScores]);

  useEffect(() => {
    if (scores.length > 0) {
      fetchNames();
    }
  }, [scores, fetchNames]);

  // Transform scores into a format suitable for the DataTable
  const transformScores = () => {
    const transformedData = {};
    const criteriaSet = new Set();

    // Organize scores by product and collect criteria
    scores.forEach((score) => {
      const {
        product_id,
        criteria_id,
        score: scoreValue,
        score_one,
        score_two,
      } = score;

      if (!transformedData[product_id]) {
        transformedData[product_id] = {
          id: product_id,
          name: productNames[product_id] || `Product ${product_id}`,
        };
      }

      transformedData[product_id][`criteria_${criteria_id}`] = scoreValue;
      transformedData[product_id][`score_one`] = score_one;
      transformedData[product_id][`score_two`] = score_two;
      criteriaSet.add(criteria_id);
    });

    // Convert the transformed data into an array
    const finalData = Object.values(transformedData);
    return { finalData, criteria: Array.from(criteriaSet) };
  };

  const { finalData, criteria } = transformScores();

  // Transform scores for score_one and score_two
  const transformScoreOne = () => {
    const transformedData = {};
    scores.forEach((score) => {
      const { product_id, criteria_id, score_one } = score;

      if (!transformedData[product_id]) {
        transformedData[product_id] = {
          id: product_id,
          name: productNames[product_id] || `Product ${product_id}`,
        };
      }

      transformedData[product_id][`criteria_${criteria_id}`] = score_one;
    });

    return Object.values(transformedData);
  };

  const finalDataScoreOne = transformScoreOne();

  const transformScoreTwo = () => {
    const transformedData = {};
    scores.forEach((score) => {
      const { product_id, criteria_id, score_two } = score;

      if (!transformedData[product_id]) {
        transformedData[product_id] = {
          id: product_id,
          name: productNames[product_id] || `Product ${product_id}`,
        };
      }

      transformedData[product_id][`criteria_${criteria_id}`] = score_two;
    });

    return Object.values(transformedData);
  };

  const finalDataScoreTwo = transformScoreTwo();

  const transformFinalScores = () => {
    const transformedData = {};

    finalScores.forEach((score) => {
      const { id, product_id, final_score, created_at } = score;

      if (!transformedData[product_id]) {
        const date = new Date(created_at);
        const monthNames = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        transformedData[product_id] = {
          id: id,
          name: productNames[product_id] || `Product ${product_id}`,
          final_score: parseFloat(final_score).toFixed(2),
          created_at: `${month} ${year}`,
        };
      }
    });

    return Object.values(transformedData).sort(
      (a, b) => b.final_score - a.final_score
    );
  };

  const finalDataScores = transformFinalScores();

  const handleDeleteAndSafeFinalScore = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");

      // Make the POST request
      const response = await axios.post(
        `http://localhost:8080/api/scores/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response from the POST request
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Nilai MOORA berhasil dihitung",
          showConfirmButton: false,
          timer: 1500,
        });
      }
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
      window.location.reload();
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
                className="btn btn-primary mx-2"
                onClick={handlePerhitungan}
              >
                <i className="fas fa-calculator me-2 mx-1"></i>
                Proses Perhitungan Nilai Awal
              </button>
              <button
                className="btn btn-success"
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
                <h3 className="card-title">Perhitungan Awal</h3>
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
                    emptyMessage="Data Nilai Awal masih kosong"
                  >
                    <Column field="name" header="Nama Produk" sortable />
                    {criteria.map((criteriaId) => (
                      <Column
                        key={criteriaId}
                        field={`criteria_${criteriaId}`}
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
                    value={finalDataScoreOne}
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
                        field={`criteria_${criteriaId}`}
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
                    value={finalDataScoreTwo}
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
                        field={`criteria_${criteriaId}`}
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
                    <Column field="name" header="Nama Produk" sortable />
                    <Column
                      field="final_score"
                      header="Nilai Akhir"
                      sortable
                      body={(rowData) => (
                        <span>
                          {parseFloat(rowData.final_score).toFixed(2)}
                        </span>
                      )}
                    />
                    <Column field="created_at" header="Periode" sortable />
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

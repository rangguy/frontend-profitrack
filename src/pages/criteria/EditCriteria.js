import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Input from "../../components/form/Input";

const API_BASE_URL = process.env.REACT_APP_API_LOCAL;

const EditCriteria = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    criteriaName: "",
    weight: "",
    type: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({
    weight: "",
    type: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const validateWeight = (value) => {
    if (!value) {
      return "Bobot kriteria tidak boleh kosong";
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return "Bobot harus berupa angka";
    }

    if (numValue < 0 || numValue > 1) {
      return "Masukkan bobot antara 0 - 1";
    }

    return "";
  };

  const validateType = (value) => {
    if (!value) {
      return "Tipe kriteria tidak boleh kosong";
    }

    if (!["Benefit", "Cost"].includes(value)) {
      return "Tipe kriteria harus Benefit atau Cost";
    }

    return "";
  };

  useEffect(() => {
    const fetchCriteriaDetail = async () => {
      const token = Cookies.get("token");

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "Silakan Login terlebih dahulu.",
        });
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/criterias/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = {
          criteriaName: response.data.name,
          weight: response.data.weight.toString(),
          type: response.data.type,
        };

        setFormData(data);
        setOriginalData(data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch criteria data";

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });

        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCriteriaDetail();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    let validationError = "";
    switch (id) {
      case "weight":
        validationError = validateWeight(value);
        break;
      case "type":
        validationError = validateType(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [id]: validationError,
    }));

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const checkIfDataChanged = () => {
    if (!originalData) return false;

    return (
      formData.weight !== originalData.weight ||
      formData.type !== originalData.type
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const weightError = validateWeight(formData.weight);
    const typeError = validateType(formData.type);

    setErrors({
      weight: weightError,
      type: typeError,
    });

    if (weightError || typeError) {
      Swal.fire({
        icon: "error",
        title: "Validasi Error",
        text: "Mohon periksa kembali input Anda",
      });
      return;
    }

    const token = Cookies.get("token");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Please login to continue.",
      });
      return;
    }

    if (!checkIfDataChanged()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Tidak ada perubahan data",
      });
      return;
    }

    setIsLoading(true);

    const requestBody = {
      weight: parseFloat(formData.weight),
      type: formData.type,
    };

    try {
      await axios.put(`${API_BASE_URL}/criterias/${id}`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Berhasil Mengubah Data Kriteria!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      navigate("/criterias");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong!";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>{props.title}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/criterias">Kriteria</Link>
                </li>
                <li className="breadcrumb-item active">{props.title}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content px-3 pb-3">
        <form onSubmit={handleSubmit}>
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">Form Data Kriteria</h3>
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
              <div className="form-group">
                <label htmlFor="criteriaName" className="font-weight-bold">
                  Nama Kriteria
                </label>
                <select
                  id="criteriaName"
                  className="form-control"
                  value={formData.criteriaName}
                  onChange={handleChange}
                  disabled
                >
                  <option value="">{formData.criteriaName}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="weight" className="font-weight-bold">
                  Bobot
                </label>
                <div className="input-group">
                  <Input
                    type="number"
                    id="weight"
                    name="weight"
                    className={`form-control ${
                      errors.weight ? "is-invalid" : ""
                    }`}
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Masukkan bobot (0-1)"
                    min="0"
                    max="1"
                    step="0.01"
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">
                      <i className="fas fa-balance-scale"></i>
                    </span>
                  </div>
                </div>
                {errors.weight && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    {errors.weight}
                  </div>
                )}
                <div className="alert alert-info mt-2">
                  <i className="fas fa-info-circle mr-2"></i>
                  <strong>Keterangan:</strong> Nilai bobot menunjukkan
                  persentase kepentingan kriteria ini dibandingkan kriteria
                  lainnya. Nilai yang dimasukkan merupakan bobot yang telah
                  dinormalisasi, sehingga jumlah seluruh bobot kriteria harus
                  sama dengan 1 (atau 100%). Contoh: bobot 0.25 berarti kriteria
                  ini memiliki tingkat kepentingan sebesar 25% dari total
                  keseluruhan kriteria.
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="type" className="font-weight-bold">
                  Tipe
                </label>
                <select
                  id="type"
                  className={`form-control ${errors.type ? "is-invalid" : ""}`}
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Pilih Tipe Kriteria</option>
                  <option value="Benefit">Benefit</option>
                  <option value="Cost">Cost</option>
                </select>
                {errors.type && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    {errors.type}
                  </div>
                )}
                <div className="mt-2">
                  <div className="badge badge-success p-2 mr-2">
                    <i className="fas fa-arrow-up mr-1"></i> Benefit: Semakin
                    tinggi nilai semakin baik
                  </div>
                  <div className="badge badge-danger p-2">
                    <i className="fas fa-arrow-down mr-1"></i> Cost: Semakin
                    rendah nilai semakin baik
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-between">
                <Link to="/criterias" className="btn btn-secondary">
                  <i className="fas fa-arrow-left mr-1"></i> Batal
                </Link>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={
                    isLoading ||
                    !!errors.weight ||
                    !!errors.type ||
                    !formData.weight ||
                    !formData.type
                  }
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-1"></i>{" "}
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-1"></i> Ubah Data Kriteria
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditCriteria;

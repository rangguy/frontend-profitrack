import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Input from "../../components/form/Input";

const EditCriteria = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

    if (numValue < 0 || numValue > 6) {
      return "Masukkan bobot antara 1 - 5";
    }

    if (!Number.isInteger(numValue)) {
      return "Bobot harus berupa bilangan bulat";
    }

    return "";
  };

  const validateType = (value) => {
    if (!value) {
      return "Tipe kriteria tidak boleh kosong";
    }

    if (!["benefit", "cost"].includes(value)) {
      return "Tipe kriteria harus benefit atau cost";
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
          text: "Please login to continue.",
        });
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/criterias/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = {
          criteriaName: response.data.name,
          weight: response.data.weight,
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

    if (
      originalData &&
      formData.weight === originalData.weight &&
      formData.type === originalData.type
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Masukkan setidaknya satu data baru",
      });
      return;
    }

    const requestBody = {
      weight: parseInt(formData.weight),
      type: formData.type,
    };

    try {
      await axios.put(
        `http://localhost:8080/api/criterias/${id}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kriteria Berhasil Diubah",
      }).then(() => {
        navigate("/criterias");
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong!";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
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
      <section className="content px-3">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col">
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
                    <label htmlFor="criteriaName">Nama Kriteria</label>
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
                    <label htmlFor="weight">Bobot</label>
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
                    />
                    {errors.weight && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.weight}
                      </div>
                    )}
                    <small className="form-text text-muted">
                      Bobot harus berupa bilangan bulat antara 0 dan 1
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="type">Tipe</label>
                    <select
                      id="type"
                      className={`form-control ${
                        errors.type ? "is-invalid" : ""
                      }`}
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="">Pilih Tipe Kriteria</option>
                      <option value="benefit">Benefit</option>
                      <option value="cost">Cost</option>
                    </select>
                    {errors.type && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.type}
                      </div>
                    )}
                    <small className="form-text text-muted">
                      Benefit: Semakin tinggi nilai semakin baik
                      <br />
                      Cost: Semakin rendah nilai semakin baik
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Link to="/criterias" className="btn btn-secondary">
                Batal
              </Link>
              <button
                type="submit"
                className="btn btn-success float-right"
                disabled={
                  !!errors.weight ||
                  !!errors.type ||
                  !formData.weight ||
                  !formData.type
                }
              >
                Ubah Data Kriteria
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditCriteria;

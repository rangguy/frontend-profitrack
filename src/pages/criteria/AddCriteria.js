import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/form/Input";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const AddCriteria = (props) => {
  const [formData, setFormData] = useState({
    criteriaName: "",
    weight: "",
    type: "",
  });

  const [errors, setErrors] = useState({
    criteriaName: "",
    weight: "",
    type: "",
  });

  const navigate = useNavigate();

  const validCriteriaNames = [
    "Return On Investment",
    "Net Profit Margin",
    "Rasio Efisiensi",
  ];

  const validateCriteriaName = (value) => {
    if (!value) {
      return "Nama kriteria tidak boleh kosong";
    }

    if (!validCriteriaNames.includes(value)) {
      return "Nama kriteria harus Return On Investment, Net Profit Margin, atau Rasio Efisiensi";
    }

    return "";
  };

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

    if (!["benefit", "cost"].includes(value)) {
      return "Tipe kriteria harus benefit atau cost";
    }

    return "";
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    let validationError = "";
    switch (id) {
      case "criteriaName":
        validationError = validateCriteriaName(value);
        break;
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

    const nameError = validateCriteriaName(formData.criteriaName);
    const weightError = validateWeight(formData.weight);
    const typeError = validateType(formData.type);

    setErrors({
      criteriaName: nameError,
      weight: weightError,
      type: typeError,
    });

    if (nameError || weightError || typeError) {
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

    const requestBody = {
      name: formData.criteriaName.trim(),
      weight: parseFloat(formData.weight),
      type: formData.type,
    };

    try {
      await axios.post(
        `${API_BASE_URL}/criterias`,
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
        text: "Kriteria Berhasil Ditambahkan",
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
                      className={`form-control ${
                        errors.criteriaName ? "is-invalid" : ""
                      }`}
                      value={formData.criteriaName}
                      onChange={handleChange}
                    >
                      <option value="">Pilih Nama Kriteria</option>
                      {validCriteriaNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    {errors.criteriaName && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.criteriaName}
                      </div>
                    )}
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
                    <small className="form-text text-muted">
                      Gunakan titik "."
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
                  !!errors.criteriaName ||
                  !!errors.weight ||
                  !!errors.type ||
                  !formData.criteriaName ||
                  !formData.weight ||
                  !formData.type
                }
              >
                Simpan Data Kriteria
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddCriteria;

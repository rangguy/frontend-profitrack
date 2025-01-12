import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const EditCategory = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryName: "",
  });
  const [initialFormData, setInitialFormData] = useState({
    categoryName: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateInput = (value) => {
    if (value.startsWith(" ") || value.endsWith(" ")) {
      return "Nama kategori tidak boleh diawali atau diakhiri dengan spasi";
    }

    if (value.includes("  ")) {
      return "Nama kategori tidak boleh mengandung spasi berurutan";
    }

    if (!value.trim()) {
      return "Nama kategori tidak boleh kosong";
    }

    if (!/[A-Za-z]/.test(value)) {
      return "Nama kategori harus mengandung setidaknya satu huruf";
    }

    return "";
  };

  useEffect(() => {
    const fetchCategoryDetail = async () => {
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
          `http://localhost:8080/api/categories/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData({
          categoryName: response.data.name,
        });
        setInitialFormData({
          categoryName: response.data.name,
        });
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch category data";

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

    fetchCategoryDetail();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    const validationError = validateInput(value);
    setError(validationError);

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    const validationError = validateInput(formData.categoryName);
    if (validationError) {
      Swal.fire({
        icon: "error",
        title: "Validasi Error",
        text: validationError,
      });
      return;
    }

    if (formData.categoryName.trim() === initialFormData.categoryName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Masukkan setidaknya satu data baru",
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
      navigate("/login");
      return;
    }

    const requestBody = {
      name: formData.categoryName.trim(),
    };

    try {
      setIsLoading(true);
      await axios.put(
        `http://localhost:8080/api/categories/${id}`,
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
        text: "Kategori Berhasil Diperbarui",
      }).then(() => {
        navigate("/categories");
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong!";

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
                  <Link to="/categories">Kategori</Link>
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
                  <h3 className="card-title">Data Kategori</h3>
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
                    <label htmlFor="categoryName">Nama Kategori</label>
                    <input
                      type="text"
                      id="categoryName"
                      name="categoryName"
                      className={`form-control ${error ? "is-invalid" : ""}`}
                      value={formData.categoryName}
                      onChange={handleChange}
                      placeholder="Masukkan nama kategori"
                    />
                    {error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Link to="/categories" className="btn btn-secondary">
                Batal
              </Link>
              <button
                type="submit"
                className="btn btn-success float-right"
                disabled={!!error || !formData.categoryName.trim() || isLoading}
              >
                {isLoading ? "Menyimpan..." : "Ubah Data Kategori"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditCategory;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/form/Input";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const validationRules = {
  name: (value) => {
    if (!value?.trim()) return "Nama produk tidak boleh kosong";
    return "";
  },
  purchase_cost: (value) => {
    if (!value) return "Harga beli tidak boleh kosong";
    const cost = parseFloat(value);
    if (isNaN(cost) || cost <= 0) return "Harga beli harus lebih dari 0";
    return "";
  },
  price_sale: (value, formData) => {
    if (!value) return "Harga jual tidak boleh kosong";
    const price = parseFloat(value);
    const cost = parseFloat(formData.purchase_cost);
    if (isNaN(price) || price <= 0) return "Harga jual harus lebih dari 0";
    if (price < cost)
      return "Harga jual tidak boleh lebih kecil dari harga beli";
    return "";
  },
  unit: (value) => {
    if (!value?.trim()) return "Unit tidak boleh kosong";
    return "";
  },
  stock: (value) => {
    if (!value) return "Stok tidak boleh kosong";
    const stock = parseInt(value);
    if (isNaN(stock) || stock < 0) return "Stok tidak boleh negatif";
    return "";
  },
  sold: (value, formData) => {
    if (!value) return "Stok terjual tidak boleh kosong";
    const sold = parseInt(value);
    const stock = parseInt(formData.stock);
    if (isNaN(sold) || sold < 0) return "Stok terjual tidak boleh negatif";
    if (sold > stock) return "Stok terjual tidak boleh lebih besar dari stok";
    return "";
  },
  category_id: (value) => {
    if (!value) return "Kategori harus dipilih";
    return "";
  },
};

const initialFormData = {
  name: "",
  purchase_cost: "",
  price_sale: "",
  unit: "",
  stock: "",
  sold: "",
  category_id: "",
};

const AddProduct = ({ title }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Token not found");

      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil data kategori",
      });
    }
  };

  const validateField = (name, value) => {
    const validationRule = validationRules[name];
    return validationRule ? validationRule(value, formData) : "";
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Check if all fields are filled
    const allFieldsFilled = Object.values(formData).every(
      (value) => value !== ""
    );
    if (!allFieldsFilled) {
      isValid = false;
    }

    // Check for validation errors
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(isValid);
    return isValid;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => {
      const newFormData = { ...prev, [id]: value };

      // Validate the changed field
      const error = validateField(id, value);
      setErrors((prev) => ({ ...prev, [id]: error }));

      // Check if all fields are filled and there are no errors
      const allFieldsFilled = Object.values(newFormData).every(
        (val) => val !== ""
      );
      const hasNoErrors = Object.values({ ...errors, [id]: error }).every(
        (err) => !err
      );

      setIsValid(allFieldsFilled && hasNoErrors);

      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validasi Error",
        text: "Mohon periksa kembali input Anda",
      });
      return;
    }

    setIsLoading(true);
    const token = Cookies.get("token");

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Silakan login terlebih dahulu",
      });
      return;
    }

    try {
      const requestBody = {
        name: formData.name.trim(),
        purchase_cost: parseFloat(formData.purchase_cost),
        price_sale: parseFloat(formData.price_sale),
        unit: formData.unit.trim(),
        stock: parseInt(formData.stock),
        sold: parseInt(formData.sold),
        category_id: parseInt(formData.category_id),
      };

      await axios.post(`${API_BASE_URL}/products`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Produk berhasil ditambahkan",
      }).then(() => navigate("/products"));
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Terjadi kesalahan saat menyimpan data";
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
              <h1>{title}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/products">Produk</Link>
                </li>
                <li className="breadcrumb-item active">{title}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content px-3 pb-3">
        <form onSubmit={handleSubmit}>
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">Form Data Produk</h3>
            </div>
            <div className="card-body">
              {Object.keys(initialFormData).map((fieldId) =>
                fieldId === "category_id" ? (
                  <div className="form-group" key={fieldId}>
                    <label htmlFor={fieldId}>Kategori</label>
                    <select
                      id={fieldId}
                      className={`form-control ${
                        errors[fieldId] ? "is-invalid" : ""
                      }`}
                      value={formData[fieldId]}
                      onChange={handleChange}
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors[fieldId] && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors[fieldId]}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="form-group" key={fieldId}>
                    <label htmlFor={fieldId}>
                      {fieldId === "name" && "Nama Produk"}
                      {fieldId === "purchase_cost" && "Harga Beli"}
                      {fieldId === "price_sale" && "Harga Jual"}
                      {fieldId === "unit" && "Satuan"}
                      {fieldId === "stock" && "Stok"}
                      {fieldId === "sold" && "Stok Terjual"}
                      {fieldId === "category_id" && "Kategori"}
                    </label>
                    <Input
                      type={
                        [
                          "purchase_cost",
                          "price_sale",
                          "stock",
                          "sold",
                        ].includes(fieldId)
                          ? "number"
                          : "text"
                      }
                      id={fieldId}
                      className={`form-control ${
                        errors[fieldId] ? "is-invalid" : ""
                      }`}
                      value={formData[fieldId]}
                      onChange={handleChange}
                      placeholder={`Masukkan ${fieldId
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}`}
                    />
                    {errors[fieldId] && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors[fieldId]}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12">
              <Link to="/products" className="btn btn-secondary">
                Batal
              </Link>
              <button
                type="submit"
                className="btn btn-success float-right"
                disabled={isLoading || !isValid}
              >
                {isLoading ? "Menyimpan..." : "Simpan Data Produk"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddProduct;

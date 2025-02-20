import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/form/Input";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const validationRules = {
  name: (value) => (!value?.trim() ? "Nama produk tidak boleh kosong" : ""),
  purchase_cost: (value) => {
    if (!value) return "Harga beli tidak boleh kosong";
    const cost = parseFloat(value);
    return isNaN(cost) || cost <= 0 ? "Harga beli harus lebih dari 0" : "";
  },
  price_sale: (value, formData) => {
    if (!value) return "Harga jual tidak boleh kosong";
    const price = parseFloat(value);
    const cost = parseFloat(formData.purchase_cost);
    if (isNaN(price) || price <= 0) return "Harga jual harus lebih dari 0";
    return price < cost
      ? "Harga jual tidak boleh lebih kecil dari harga beli"
      : "";
  },
  unit: (value) => (!value?.trim() ? "Unit tidak boleh kosong" : ""),
  stock: (value) => {
    if (!value) return "Stok tidak boleh kosong";
    const stock = parseInt(value);
    return isNaN(stock) || stock < 0 ? "Stok tidak boleh negatif" : "";
  },
  sold: (value, formData) => {
    if (!value) return "Stok terjual tidak boleh kosong";
    const sold = parseInt(value);
    const stock = parseInt(formData.stock);
    if (isNaN(sold) || sold < 0) return "Stok terjual tidak boleh negatif";
    return sold > stock ? "Stok terjual tidak boleh lebih besar dari stok" : "";
  },
};

const initialFormData = {
  name: "",
  purchase_cost: "",
  price_sale: "",
  unit: "",
  stock: "",
  sold: "",
};

const AddProduct = ({ title }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) =>
    validationRules[name]?.(value, formData) || "";

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Terjadi kesalahan",
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
              {Object.keys(initialFormData).map((fieldId) => (
                <div className="form-group" key={fieldId}>
                  <label htmlFor={fieldId}>
                    {fieldId === "name" && "Nama Produk"}
                    {fieldId === "purchase_cost" && "Harga Beli"}
                    {fieldId === "price_sale" && "Harga Jual"}
                    {fieldId === "unit" && "Unit"}
                    {fieldId === "stock" && "Stok"}
                    {fieldId === "sold" && "Stok Terjual"}
                  </label>
                  <Input
                    type={
                      ["purchase_cost", "price_sale", "stock", "sold"].includes(
                        fieldId
                      )
                        ? "number"
                        : "text"
                    }
                    id={fieldId}
                    className={`form-control ${
                      errors[fieldId] ? "is-invalid" : ""
                    }`}
                    value={formData[fieldId]}
                    onChange={handleChange}
                    placeholder={`Masukkan ${fieldId === "name" ? "Nama Produk" : fieldId === "purchase_cost" ? "Harga Beli" : fieldId === "price_sale" ? "Harga Jual" : fieldId === "unit" ? "Unit" : fieldId === "stock" ? "Stok" : "Stok Terjual"}`}
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
              ))}
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
                disabled={isLoading}
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
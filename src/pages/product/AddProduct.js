import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/form/Input";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_LOCAL;

const units = ["Pcs", "Kg", "Liter", "Box"];

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
  unit: (value) => (!value?.trim() ? "Satuan tidak boleh kosong" : ""),
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

const AddProduct = (props) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Silakan Login terlebih dahulu.",
      });
      navigate("/login");
      return;
    }
  }, [navigate]);

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
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouchedFields(allTouched);

    return isValid;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    setTouchedFields((prev) => ({ ...prev, [id]: true }));

    const error = validateField(id, value);
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouchedFields((prev) => ({ ...prev, [id]: true }));

    const error = validateField(id, formData[id]);
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const errorFields = Object.keys(errors).filter((key) => errors[key]);
      const errorMessages = errorFields
        .map((field) => `- ${errors[field]}`)
        .join("\n");

      Swal.fire({
        icon: "error",
        title: "Validasi Error",
        text: "Mohon periksa kembali input Anda:",
        html: `<div class="text-left">${errorMessages.replace(
          /\n/g,
          "<br>"
        )}</div>`,
      });
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("token");
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
        title: "Berhasil!",
        text: "Produk Berhasil Ditambahkan!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      navigate("/products");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Terjadi Kesalahan";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shouldShowError = (fieldName) => {
    return touchedFields[fieldName] && errors[fieldName];
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
                  <Link to="/products">Produk</Link>
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
              <h3 className="card-title">Form Data Produk</h3>
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
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group">
                    <label>Nama Produk</label>
                    <Input
                      type="text"
                      id="name"
                      className={`form-control ${
                        shouldShowError("name") ? "is-invalid" : ""
                      }`}
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Produk A"
                    />
                    {shouldShowError("name") && (
                      <div className="invalid-feedback d-block">
                        {errors.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Satuan</label>
                    <select
                      id="unit"
                      className={`form-control ${
                        shouldShowError("unit") ? "is-invalid" : ""
                      }`}
                      value={formData.unit}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Pilih Satuan</option>
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  {shouldShowError("unit") && (
                    <div className="invalid-feedback d-block">
                      {errors.unit}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Harga Beli</label>
                    <Input
                      type="number"
                      id="purchase_cost"
                      className={`form-control ${
                        shouldShowError("purchase_cost") ? "is-invalid" : ""
                      }`}
                      value={formData.purchase_cost}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="12000"
                    />
                    {shouldShowError("purchase_cost") && (
                      <div className="invalid-feedback d-block">
                        {errors.purchase_cost}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Harga Jual</label>
                    <Input
                      type="number"
                      id="price_sale"
                      className={`form-control ${
                        shouldShowError("price_sale") ? "is-invalid" : ""
                      }`}
                      value={formData.price_sale}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="13000"
                    />
                    {shouldShowError("price_sale") && (
                      <div className="invalid-feedback d-block">
                        {errors.price_sale}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Stok</label>
                    <Input
                      type="number"
                      id="stock"
                      className={`form-control ${
                        shouldShowError("stock") ? "is-invalid" : ""
                      }`}
                      value={formData.stock}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="200"
                    />
                    {shouldShowError("stock") && (
                      <div className="invalid-feedback d-block">
                        {errors.stock}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Stok Terjual</label>
                    <Input
                      type="number"
                      id="sold"
                      className={`form-control ${
                        shouldShowError("sold") ? "is-invalid" : ""
                      }`}
                      value={formData.sold}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="100"
                    />
                    {shouldShowError("sold") && (
                      <div className="invalid-feedback d-block">
                        {errors.sold}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-between">
                <Link to="/products" className="btn btn-secondary">
                  <i className="fas fa-arrow-left mr-1"></i> Batal
                </Link>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={
                    isLoading ||
                    !!errors.name ||
                    !!errors.purchase_cost ||
                    !!errors.price_sale ||
                    !!errors.unit ||
                    !!errors.stock ||
                    !!errors.sold ||
                    !formData.name ||
                    !formData.purchase_cost ||
                    !formData.price_sale ||
                    !formData.unit ||
                    !formData.stock ||
                    !formData.sold
                  }
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-1"></i>{" "}
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-1"></i> Simpan Data Produk
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

export default AddProduct;

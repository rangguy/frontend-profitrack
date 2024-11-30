import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/form/Input";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import axios from "axios";

const AddProduct = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    net_profit: "",
    gross_profit: "",
    price_sale: "",
    purchase_cost: "",
    initial_stock: "",
    final_stock: "",
    category_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({
    name: "",
    net_profit: "",
    gross_profit: "",
    price_sale: "",
    purchase_cost: "",
    initial_stock: "",
    final_stock: "",
    category_id: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get("http://localhost:8080/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch categories",
      });
    }
  };

  const validateField = (name, value) => {
    if (!value) {
      return `${name} tidak boleh kosong`;
    }

    if (name !== "name" && name !== "category_id") {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        return `${name} harus berupa angka lebih dari 0`;
      }
    }

    return "";
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const validationError = validateField(id, value);

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

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      newErrors[key] = validateField(key, formData[key]);
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
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
      name: formData.name.trim(),
      net_profit: parseFloat(formData.net_profit),
      gross_profit: parseFloat(formData.gross_profit),
      price_sale: parseFloat(formData.price_sale),
      purchase_cost: parseFloat(formData.purchase_cost),
      initial_stock: parseInt(formData.initial_stock),
      final_stock: parseInt(formData.final_stock),
      category_id: parseInt(formData.category_id),
    };

    try {
      await axios.post("http://localhost:8080/api/products", requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Produk Berhasil Ditambahkan",
      }).then(() => {
        navigate("/products");
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
          <div className="row">
            <div className="col">
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
                  <div className="form-group">
                    <label htmlFor="name">Nama Produk</label>
                    <Input
                      type="text"
                      id="name"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Masukkan nama produk"
                    />
                    {errors.name && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="net_profit">Net Profit</label>

                    <Input
                      type="number"
                      id="net_profit"
                      className={`form-control ${
                        errors.net_profit ? "is-invalid" : ""
                      }`}
                      value={formData.net_profit}
                      onChange={handleChange}
                      placeholder="Masukkan net profit"
                    />
                    {errors.net_profit && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.net_profit}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="gross_profit">Gross Profit</label>
                    <Input
                      type="number"
                      id="gross_profit"
                      className={`form-control ${
                        errors.gross_profit ? "is-invalid" : ""
                      }`}
                      value={formData.gross_profit}
                      onChange={handleChange}
                      placeholder="Masukkan gross profit"
                    />
                    {errors.gross_profit && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.gross_profit}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="price_sale">Harga Jual</label>
                    <Input
                      type="number"
                      id="price_sale"
                      className={`form-control ${
                        errors.price_sale ? "is-invalid" : ""
                      }`}
                      value={formData.price_sale}
                      onChange={handleChange}
                      placeholder="Masukkan Harga Jual"
                    />
                    {errors.price_sale && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.price_sale}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="purchase_cost">Harga Beli</label>
                    <Input
                      type="number"
                      id="purchase_cost"
                      className={`form-control ${
                        errors.purchase_cost ? "is-invalid" : ""
                      }`}
                      value={formData.purchase_cost}
                      onChange={handleChange}
                      placeholder="Masukkan Harga Beli"
                    />
                    {errors.purchase_cost && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.purchase_cost}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="initial_stock">Stok Awal</label>
                    <Input
                      type="number"
                      id="initial_stock"
                      className={`form-control ${
                        errors.initial_stock ? "is-invalid" : ""
                      }`}
                      value={formData.initial_stock}
                      onChange={handleChange}
                      placeholder="Masukkan Stok Awal"
                    />
                    {errors.initial_stock && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.initial_stock}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="final_stock">Stok Akhir</label>
                    <Input
                      type="number"
                      id="final_stock"
                      className={`form-control ${
                        errors.final_stock ? "is-invalid" : ""
                      }`}
                      value={formData.final_stock}
                      onChange={handleChange}
                      placeholder="Masukkan Stok Akhir"
                    />
                    {errors.final_stock && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.final_stock}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="category_id">Kategori</label>
                    <select
                      id="category_id"
                      className={`form-control ${
                        errors.category_id ? "is-invalid" : ""
                      }`}
                      value={formData.category_id}
                      onChange={handleChange}
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {errors.category_id}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Link to="/products" className="btn btn-secondary">
                Batal
              </Link>
              <button
                type="submit"
                className="btn btn-success float-right"
                disabled={
                  Object.values(errors).some((error) => error) ||
                  Object.values(formData).some((value) => !value)
                }
              >
                Simpan Data Produk
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddProduct;

import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Product = (props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get("http://localhost:8080/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        navigate("/login");
      } else {
        console.error("Error fetching products:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Action button functions
  const handleAdd = () => {
    console.log("Add product");
    navigator("/product/add");
  };

  const handleEdit = (product) => {
    console.log("Edit product", product);
    // Edit product logic here
  };

  const handleDelete = async (productId) => {
    const token = Cookies.get("token");
    try {
      await axios.delete(`http://localhost:8080/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product.id !== productId));
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <button
          onClick={() => handleEdit(rowData)}
          className="btn btn-primary btn-sm mr-2"
        >
          Ubah
        </button>
        <button
          onClick={() => handleDelete(rowData.id)}
          className="btn btn-danger btn-sm"
        >
          Hapus
        </button>
      </div>
    );
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
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">{props.title}</li>
              </ol>
            </div>
          </div>
          {/* Add Button */}
          <button onClick={handleAdd} className="btn btn-success mb-3">
            Tambah Produk
          </button>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <DataTable
            value={products}
            stripedRows
            rowHover
            paginator
            rows={10}
            loading={loading}
            emptyMessage="No products found."
          >
            <Column field="name" header="Name" sortable />
            <Column field="category_name" header="Category" sortable />
            <Column field="net_profit" header="Keuntungan Bersih" sortable />
            <Column field="gross_profit" header="Keuntungan Kotor" sortable />
            <Column field="gross_sale" header="Penjualan Kotor" sortable />
            <Column field="purchase_cost" header="Harga Beli" sortable />
            <Column field="initial_stock" header="Stok Awal" sortable />
            <Column field="final_stock" header="Stok Akhir" sortable />
            <Column
              field="action"
              header="Action"
              body={actionBodyTemplate}
              style={{ textAlign: "center", width: "180px" }}
            />
          </DataTable>
        </div>
      </section>
    </div>
  );
};

export default Product;

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const ReportDetail = (props) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id, methodName } = useParams();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/reports/${id}`, {
          withCredentials: true,
        });
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  return (
    <div>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">{props.title} {methodName}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/reports">Laporan</Link>
                </li>
                <li className="breadcrumb-item active">{props.title}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <DataTable
            value={reports}
            stripedRows
            rowHover
            paginator
            rows={10}
            loading={loading}
            emptyMessage="Data laporan masih kosong"
          >
            <Column
              header="Rank"
              body={(rowData, { rowIndex }) => rowIndex + 1}
              sortable
            />
            <Column field="product.name" header="Nama Produk" sortable />
            <Column
              field="final_scores"
              header="Skor Akhir"
              sortable
              body={(rowData) => rowData.final_scores}
            />
            <Column
              field="product.purchase_cost"
              header="Harga Beli"
              sortable
              body={(rowData) => formatCurrency(rowData.product.purchase_cost)}
            />
            <Column
              field="product.price_sale"
              header="Harga Jual"
              sortable
              body={(rowData) => formatCurrency(rowData.product.price_sale)}
            />
            <Column
              field="product.profit"
              header="Keuntungan"
              sortable
              body={(rowData) => formatCurrency(rowData.product.profit)}
            />
            <Column field="product.unit" header="Satuan" sortable />
            <Column field="product.stock" header="Stok" sortable />
            <Column field="product.sold" header="Stok Terjual" sortable />
          </DataTable>
        </div>
      </section>
    </div>
  );
};

export default ReportDetail;

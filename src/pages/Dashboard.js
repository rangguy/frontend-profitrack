import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = (props) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    net_profit: [],
    gross_profit: [],
    price_sale: [],
    purchase_cost: [],
    labels: [],
  });

  useEffect(() => {
    // Check authentication token
    const jwtToken = Cookies.get("token");
    if (!jwtToken) {
      navigate("/login");
    }

    // Fetch product data
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products", {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        const products = response.data;

        // Prepare data for charts
        const labels = products.map(
          (product) => product.name || `Product ${product.id}`
        );
        const net_profit = products.map((product) => product.net_profit);
        const gross_profit = products.map((product) => product.gross_profit);
        const price_sale = products.map((product) => product.price_sale);
        const purchase_cost = products.map((product) => product.purchase_cost);

        setData({
          labels,
          net_profit,
          gross_profit,
          price_sale,
          purchase_cost,
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData();
  }, [navigate]);

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div>
      {/* Content Header */}
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
        </div>
      </div>

      {/* Main Content */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* Keuntungan Bersih Chart */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Keuntungan Bersih</h3>
                </div>
                <div className="card-body">
                  <Bar
                    data={{
                      labels: data.labels,
                      datasets: [
                        {
                          label: "Keuntungan Bersih",
                          data: data.net_profit,
                          backgroundColor: "rgba(75, 192, 192, 0.6)",
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>

            {/* Keuntungan Kotor Chart */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Keuntungan Kotor</h3>
                </div>
                <div className="card-body">
                  <Bar
                    data={{
                      labels: data.labels,
                      datasets: [
                        {
                          label: "Keuntungan Kotor",
                          data: data.gross_profit,
                          backgroundColor: "rgba(153, 102, 255, 0.6)",
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>

            {/* Penjualan Kotor Chart */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Penjualan Kotor</h3>
                </div>
                <div className="card-body">
                  <Bar
                    data={{
                      labels: data.labels,
                      datasets: [
                        {
                          label: "Penjualan Kotor",
                          data: data.price_sale,
                          backgroundColor: "rgba(255, 159, 64, 0.6)",
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>

            {/* Biaya Pembelian Chart */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Biaya Pembelian</h3>
                </div>
                <div className="card-body">
                  <Bar
                    data={{
                      labels: data.labels,
                      datasets: [
                        {
                          label: "Biaya Pembelian",
                          data: data.purchase_cost,
                          backgroundColor: "rgba(255, 99, 132, 0.6)",
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

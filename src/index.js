import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./MainLayout";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/product/Product";
import Criteria from "./pages/criteria/Criteria";
import ErrorNotFound from "./pages/error/ErrorNotFound";
import ErrorServer from "./pages/error/ErrorServer";
import AddCriteria from "./pages/criteria/AddCriteria";
import EditCriteria from "./pages/criteria/EditCriteria";
import AddProduct from "./pages/product/AddProduct.js";
import Method from "./pages/method/Method.js";
import ScoreSMART from "./pages/score/ScoreSMART.js";
import ScoreMOORA from "./pages/score/ScoreMOORA.js";
import EditProduct from "./pages/product/EditProduct.js";
import Report from "./pages/report/Report.js";
import CriteriaScore from "./pages/criteria_score/CriteriaScore.js";
import Profile from "./pages/profile/Profile.js";

const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const statusCode = error.status || error.statusCode;
    if (statusCode === 404) {
      return <ErrorNotFound />;
    }

    if (statusCode === 500) {
      return <ErrorServer />;
    }
  }
  return <ErrorServer />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard title="Dashboard" />,
          },
          {
            path:"/profile",
            element: <Profile title="Data User"/>,
          },
          {
            path: "/products",
            element: <Product title="Data Produk" />,
          },
          {
            path: "/products/add",
            element: <AddProduct title="Tambah Data Produk" />,
          },
          {
            path: "/products/:id",
            element: <EditProduct title="Ubah Data Produk" />,
          },
          {
            path: "/criterias",
            element: <Criteria title="Data Kriteria" />,
          },
          {
            path: "/criterias/add",
            element: <AddCriteria title="Tambah Data Kriteria" />,
          },
          {
            path: "/criterias/:id",
            element: <EditCriteria title="Ubah Data Kriteria" />,
          },
          {
            path: "/criteria_scores",
            element: <CriteriaScore title="Data Nilai Kriteria" />,
          },
          {
            path: "/methods",
            element: <Method title="Metode" />,
          },
          {
            path: "/methods/:id/SMART",
            element: <ScoreSMART title="Data Nilai SMART" />,
          },
          {
            path: "/methods/:id/MOORA",
            element: <ScoreMOORA title="Data Nilai MOORA" />,
          },
          {
            path: "/reports",
            element: <Report title="Laporan " />
          }
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

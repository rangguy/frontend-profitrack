import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./MainLayout";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import Category from "./pages/Category";
import Criteria from "./pages/Criteria";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard title="Dashboard" />,
          },
          {
            path: "categories",
            element: <Category title="Data Kategori" />,
          },
          {
            path: "products",
            element: <Product title="Data Produk" />,
          },
          {
            path: "criterias",
            element: <Criteria title="Data Kriteria" />,
          },
        ],
      },
      {
        path: "login",
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

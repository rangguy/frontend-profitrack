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
import Category from "./pages/category/Category";
import Criteria from "./pages/criteria/Criteria";
import ErrorNotFound from "./pages/error/ErrorNotFound";
import ErrorServer from "./pages/error/ErrorServer";

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

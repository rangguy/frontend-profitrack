import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SideNav from "./components/SideNav";

const MainLayout = () => {
  return (
    <div className="wrapper">
      <Header />
      <SideNav />
      <div className="content-wrapper">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;

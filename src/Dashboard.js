import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import Home from "./components/Home";

function Dashboard() {
  return (
    <div className="wrapper">
      <Header />
      <SideNav />
      <Home />
      <Footer />
    </div>
  );
}

export default Dashboard;

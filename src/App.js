import React from "react";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import Home from "./components/Home";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="wrapper">
      <Header />
      <Home />
      <SideNav />
      <Footer />
    </div>
  );
};

export default App;

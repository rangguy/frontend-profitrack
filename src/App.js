import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import Home from "./components/Home";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <div className="app">
        <SideNav />
        <div className="wrapper">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;

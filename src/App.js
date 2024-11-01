import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import SideNav from "./components/SideNav";

function App() {
  return (
    <div id="wrapper">
      <SideNav />
      <Header />
      <Home />
      <Footer />
    </div>
  );
}

export default App;

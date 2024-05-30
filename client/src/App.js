import logo from "./logo.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Components/Header/Header";

function App() {
  return (
    <>
      <Header />
      <Toaster />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;

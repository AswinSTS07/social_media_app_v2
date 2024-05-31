import logo from "./logo.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Components/Header/Header";
import { useEffect, useState } from "react";

function App() {
  const [uid, setUid] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const fetchUser = () => {
      let user = JSON.parse(localStorage.getItem("userInfo"));
      if (user) {
        setUid(user?.id);
        setUserInfo(user);
      }
    };
    fetchUser();
  }, []);
  return (
    <>
      <Header uid={uid} />
      <Toaster />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;

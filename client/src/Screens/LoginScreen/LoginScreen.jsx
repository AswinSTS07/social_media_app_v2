import React, { useState } from "react";
import "./LoginScreen.css";
import axios from "axios";
import { BASE_URL } from "../../constant";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setToken, setUser } from "../../redux/userSlice";
import logo from "../../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        const res = await axios.post(`${BASE_URL}/api/password`, formData);
        setLoading(false);
        if (res && res.status == 200) {
          Swal.fire({
            title: "Success!",
            text: "Login successful!",
            icon: "success",
          }).then(() => {
            dispatch(setToken(res?.data?.token));
            dispatch(setUser(res?.data?.data));
            localStorage.setItem("token", res?.data?.token);
            localStorage.setItem(
              "userInfo",
              JSON.stringify({
                username: res?.data?.data?.username,
                id: res?.data?.data?._id,
                profile: res?.data?.data?.profileImage,
                coverImage: res?.data?.data?.coverImage,
                private: res?.data?.data?.private,
              })
            );
            window.location.href = "/home";
          });
        }
      } catch (error) {
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: "Login failed! Please try again.",
          icon: "error",
        });
      }
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logo} className="w-50" alt="Social Media" />
      </div>
      <div className="login-right">
        <div className="login-box">
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {errors.email}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "0px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {errors.password}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="loginBtn">
              {loading ? <>Please wait...</> : <>Login</>}
            </button>

            <div
              className="mt-3"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {/* <a href="/forgot-password">Forgot password</a> */}
              <a href="/register">Create new Account ?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;

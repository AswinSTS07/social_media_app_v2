import React, { useState } from "react";
import "./LoginScreen.css";
import axios from "axios";
import { BASE_URL } from "../../constant";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setToken, setUser } from "../../redux/userSlice";

function LoginScreen() {
  const [loading, setLoading] = useState(false);
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
            text: "Login successfull!",
            icon: "success",
          });
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
          window.location.href = "/";
        }
      } catch (error) {}
    }
  };

  return (
    <div className="row">
      <div className="col-md-6 bg-light">
        <div>
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/social-media-network-6992133-5737579.png?f=webp"
            className="w-100"
            alt="Social Media"
          />
        </div>
      </div>
      <div className="col-md-6 mt-5">
        <div className="center mt-5">
          <h2 className="login-text mt-5">Sign In to your account</h2>
        </div>
        <div className="container p-5">
          <form onSubmit={handleSubmit}>
            <div style={{ marginLeft: 40, marginTop: 40 }}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  className={`w-100 p-2 ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Email / username"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="form-group mt-5">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className={`w-100 p-2 ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-primary mt-4 w-100 p-2"
                disabled={loading}
              >
                {loading ? <>Please wait...</> : <>Login</>}
              </button>
              <div
                className="mt-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <a href="/forgot-password">Forgot password</a>
                <a href="/register">Create new Account ?</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;

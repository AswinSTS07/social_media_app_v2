import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../../constant";
import Swal from "sweetalert2";

function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
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
        const res = await axios.post(`${BASE_URL}/api/register`, formData);
        setLoading(false);
        if (res && res.status == 201) {
          Swal.fire({
            title: "Success!",
            text: "Account created successfully!",
            icon: "success",
          });

          window.location.href = "/login";
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
        <div className="center mt-3">
          <h2 className="login-text mt-5">Create new account</h2>
        </div>
        <div className="container p-5">
          <form onSubmit={handleSubmit}>
            <div style={{ marginLeft: 40, marginTop: 40 }}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  className={`w-100 p-2 ${errors.username ? "is-invalid" : ""}`}
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>
              <div className="form-group mt-2">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className={`w-100 p-2 ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="form-group mt-2">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className={`w-100 p-2 ${errors.password ? "is-invalid" : ""}`}
                  placeholder="****"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
              <div className="form-group mt-2">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`w-100 p-2 ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  placeholder="****"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary mt-4 w-100 p-2">
                {loading ? <>Please wait...</> : <>Register</>}
              </button>
              <div
                className="mt-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <a href="/forgot-password">Forgot password</a>
                <a href="/login">Already have an Account?</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;

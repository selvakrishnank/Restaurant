import { useState } from "react";
import "./CSS/Signin.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔐 LOGIN FUNCTION (JWT)
  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);

        alert("Login Successful ✅");

        switch (data.role) {
          case "owner":
            navigate("/owner-dashboard");
            break;
          case "manager":
            navigate("/manager-dashboard");
            break;
          case "chef":
            navigate("/kitchen");
            break;
          case "waiter":
            navigate("/waiter");
            break;
          case "customer":
            navigate("/home");
            break;
          default:
            navigate("/");
        }

      } else {
        alert(data.detail || "Invalid Credentials ❌");
      }

    } catch (error) {
      console.error("Server Error:", error);
      alert("Server not responding ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2 className="logo">Eatrova</h2>
        <p className="system-text">Restaurant Management System</p>
      </div>

      <div className="auth-card">
        <h3>Sign In</h3>
        <p className="sub">
          Enter your credentials to access your dashboard
        </p>

        <form onSubmit={handleSignin}>
          <label>Email</label>
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* 🔐 PASSWORD WITH EYE */}
          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="auth-btn">
            Sign In
          </button>
        </form>

        <p className="switch-text">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{ cursor: "pointer", color: "#ff6a00" }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
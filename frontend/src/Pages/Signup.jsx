import { useState } from "react";
import "./CSS/Signup.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "customer",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ CONNECTED TO DJANGO
  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: formData.role.toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Account Created Successfully ✅");
        navigate("/");
      } else {
        alert("Error: " + JSON.stringify(data));
      }

    } catch (error) {
      console.error("Server Error:", error);
      alert("Server not responding ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="logo">Eatrova</h2>
        <p className="subtitles">Create your account</p>

        <form onSubmit={handleSignup}>

          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your name"
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />

          <label>Select Role</label>
          <select name="role" onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="chef">Chef</option>
            <option value="waiter">Waiter</option>
            <option value="manager">Manager</option>
            <option value="owner">Owner</option>
          </select>

          {/* 🔐 PASSWORD */}
          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* 🔐 CONFIRM PASSWORD */}
          <label>Confirm Password</label>
          <div className="password-field">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button type="submit" className="auth-btn">
            Sign Up
          </button>

        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Sign In</span>
        </p>
      </div>
    </div>
  );
}
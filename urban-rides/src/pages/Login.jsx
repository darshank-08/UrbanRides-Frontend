import React, { useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/SignupNavbar.jsx";

//Switching between test and production APIs
const userAPI = {
  testApi: "http://localhost:8080/login/user",
  prodAPI: "https://urban-rides-production.up.railway.app/login/user"
};

const empAPI = {
  testApi: "http://localhost:8080/login/employee",
  prodAPI: "https://urban-rides-production.up.railway.app/login/employee"
};

const adminAPI = {
  testApi: "http://localhost:8080/login/admin",
  prodAPI: "https://urban-rides-production.up.railway.app/login/admin"
};

// Build payload based on role
const buildPayload = (role, data) => {
  if (role === "User") {
    return {
      userName: data.username,
      password: data.password
    };
  }

  if (role === "Employee") {
    return {
      username: data.username,
      password: data.password
    };
  }

  if (role === "Admin") {
    return {
      adminName: data.username,
      adminPass: data.password,
      superKey: data.superKey
    };
  }

  return null;
};

const getApiByRole = (role) => {
  if (role === "User") return userAPI.testApi;
  if (role === "Employee") return empAPI.testApi;
  if (role === "Admin") return adminAPI.testApi;
  return null;
};

// Redirect user based on role
const redirectByRole = (role, navigate) => {
  switch (role) {
    case "ROLE_OWNER":
      navigate("/Owner");
      break;

    case "ROLE_RENTER":
      navigate("/Renter");
      break;

    case "ROLE_EMPLOYEE":
      navigate("/Employee");
      break;

    case "ROLE_ADMIN":
      navigate("/Admin");
      break;

    default:
      console.error("Unknown role:", role);
  }
};

//login component
const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState({
    username: "",
    password: "",
    superKey: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!data.username || !data.password) {
      setError("All fields are required");
      return;
    }

    if (role === "Admin" && !data.superKey) {
      setError("SuperKey is required");
      return;
    }

    const payload = buildPayload(role, data);
    const api = getApiByRole(role);

    if (!payload || !api) {
      setError("Invalid role");
      return;
    }

    setLoading(true);
    console.log(payload)

    try {
      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Login failed");
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", result.userName);
      localStorage.setItem("roles", JSON.stringify(result.roles));

      redirectByRole(result.roles[0], navigate);

    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <Navbar onSelect={setRole} />

      <div className={styles.loginCard}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>
          Login to continue your ride with Urban Rides.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className={styles.input}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            onChange={handleChange}
          />

          {role === "Admin" && (
            <input
              type="password"
              name="superKey"
              placeholder="SuperKey"
              className={styles.input}
              onChange={handleChange}
            />
          )}

          <button type="submit" className={styles.loginBtn}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {role === "User" && (
          <div className={styles.footer}>
            <p>
              New to Urban Rides? <Link to="/signup">Create account</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

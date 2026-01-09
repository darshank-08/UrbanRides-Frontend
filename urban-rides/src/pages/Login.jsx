import React from 'react'
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {

  const navigate = useNavigate();

  const [data, setData] = useState({
    username : "",
    password : ""
  })

  const [loading, setLoading] = useState(false);
  const [erorr, setError] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
        [name]: value 
      });
  } 
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!data.username || !data.password) {
    setError("All fields are required");
    return;
  }

  setLoading(true);

  const payload = {
    userName: data.username.trim(),
    password: data.password.trim()
  };

  const testAPI = "http://localhost:8080/login/user";
  const ProdAPI = "https://urban-rides-production.up.railway.app/api/auth/login"

  try {
    const res = await fetch(testAPI , {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.message || "Login failed");
      return;
    }

    // STORE JWT HERE
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", result.userName);
    localStorage.setItem("roles", JSON.stringify(result.roles));

    
    navigate("/dashboard");

     } catch (error) {
      setError("Something went wrong")
     } finally{
      setLoading(false);
     }
  };

    return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>

        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>
          Login to continue your ride with Urban Rides.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" className={styles.input} onChange={handleChange}/>

          <input type="password" name="password" placeholder="Password" className={styles.input} onChange={handleChange}/>

          <button onSubmit={handleSubmit} className={styles.loginBtn}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            New to Urban Rides?{" "}
            <Link to="/signup">Create account</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login
import React from 'react'
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from "../components/SignupNavbar.jsx"
import { useEffect } from 'react';

const Login = () => {

  const navigate = useNavigate();
  const [role, setRole] = useState("User")

  const [data, setData] = useState({
    username : "",
    password : "",
    superKey : ""
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

    let payload;
    let testAPI;
    let prodAPI;

    const userAPI ={
       testApi : "http://localhost:8080/login/user",
       prodAPI : "https://urban-rides-production.up.railway.app/login/user"
    }

    const adminAPI ={
       testApi : "http://localhost:8080/login/admin",
       prodAPI : "https://urban-rides-production.up.railway.app/api/login/admin"
    }

    const superAPI ={
       testApi : "http://localhost:8080/login/superadmin",
       prodAPI : "https://urban-rides-production.up.railway.app/api/login/admin"
    }

  if(role === "User"){
    payload = {
        userName: data.username,
        password: data.password
      };

      testAPI = userAPI.testApi;
      prodAPI = userAPI.prodAPI;
      
  }else if(role === "Admin"){
    payload = {
        adminName: data.username,
        adminPass: data.password
      };

      testAPI = adminAPI.testApi;
      prodAPI = adminAPI.prodAPI;
  }else if(role === "SuperAdmin"){
      payload = {
          adminName: data.username,
          adminPass: data.password,
          superKey: data.superKey
        };

      testAPI = superAPI.testApi;
      prodAPI = superAPI.prodAPI;
  }


  try {
    const res = await fetch(testAPI , {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

      let result = {};
      try {
        result = await res.json(); 
      } catch (err) {
        console.error("JSON parse error", err);
        result = {};
      }

      if (!res.ok) {
        if (result.code === "USER_NOT_FOUND") {
          setError("User not found.");
        } else {
          setError(result.message || "Something went wrong");
        }
        return;
      }

    // STORE JWT HERE
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", result.userName);
    localStorage.setItem("roles", JSON.stringify(result.roles));

    const RoleFromAPI = (result.roles[0]);
    console.log(RoleFromAPI);

    // if(userType === "ROLE_OWNER"){
    //   navigate("/Owneer")
    // }else if(userType === "ROLE_RENTER"){
    //   navigate("/Renter")
    // }

    switch (RoleFromAPI) {
      case "ROLE_OWNER":
        navigate("/Owner")
        break;
        
      case "ROLE_RENTER":
        navigate("/Renter")
        break;  

      case "ROLE_ADMIN":
        navigate("/Admin")
        break; 

      case "ROLE_SUPERADMIN":
        navigate("/SuperAdmin")
        break; 

      default:
        break;
    }
  

     } catch (error) {
      setError("Something went wrong")
     } finally{
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

        {erorr && (
            <p className={styles.error}>{erorr}</p>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" className={styles.input} onChange={handleChange}/>

          <input type="password" name="password" placeholder="Password" className={styles.input} onChange={handleChange}/>

          {role === "SuperAdmin" && 
          <input type="password" name="superKey" placeholder="SuperKey" className={styles.input} onChange={handleChange}/>
          }

          <button type="submit" className={styles.loginBtn}>
          {loading ? "Logging in..." : "Login"}
        </button>

        </form>

        {role != "SuperAdmin" &&
          <div className={styles.footer}>
            <p>
              New to Urban Rides?{" "}
              <Link to="/signup">Create account</Link>
            </p>
          </div>
        }
        

      </div>
    </div>
  );
}

export default Login
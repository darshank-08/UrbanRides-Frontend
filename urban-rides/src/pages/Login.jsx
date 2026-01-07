import React from 'react'
import styles from "./Login.module.css";
import { Link } from "react-router-dom";

const Login = () => {
    return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>

        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>
          Login to continue your ride with Urban Rides.
        </p>

        <form className={styles.form}>
          <input type="email" placeholder="Email" className={styles.input} />

          <input type="password" placeholder="Password" className={styles.input} />

          <button className={styles.loginBtn}>
            Login
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
import React from 'react'
import styles from "../components/navbar.module.css"
import logo from "../assets/logo.png"
import { Link } from "react-router-dom"


const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.left}>
        <img className={styles.logo} src={logo} alt="Urban Rides Logo" />
        <h2 className={styles.name}>URBAN RIDES</h2>
      </Link>


      <Link to="/login" className={styles.right}>
        <button className={styles.loginBtn}>Login</button>
      </Link>
    </nav>
  );
}

export default Navbar
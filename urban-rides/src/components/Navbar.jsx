import React from 'react'
import styles from "../components/Navbar.module.css"
import logo from "../assets/logo.png"

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <img className={styles.logo} src={logo} alt="Urban Rides Logo" />
        <h2 className={styles.name}>URBAN RIDES</h2>
      </div>

      <div className={styles.right}>
        <button className={styles.loginBtn}>Login</button>
      </div>
    </nav>
  );
}

export default Navbar
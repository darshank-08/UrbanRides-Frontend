import React from "react";
import styles from "./navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      
      <div className={styles.left}>
        <h2 className={styles.logo}>Urban Rides</h2>
      </div>

      <div className={styles.right}>
        <button className={styles.loginBtn}>Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState } from 'react';
import styles from "../components/SignupNavbar.module.css";

const SignupNavbar = ({ onSelect }) => {
  // default selected is "User"
  const [selected, setSelected] = useState('User');
  

  const handleSelect = (value) => {
    setSelected(value);
    if(onSelect){
      onSelect(value);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div
        className={`${styles.button} ${
          selected === "User" ? styles.active : ""
        }`}
        onClick={() => handleSelect("User")}
      >
        User
      </div>

      <div
        className={`${styles.button} ${
          selected === "Admin" ? styles.active : ""
        }`}
        onClick={() => handleSelect("Admin")}
      >
        Admin
      </div>
    </nav>
  );
}

export default SignupNavbar;

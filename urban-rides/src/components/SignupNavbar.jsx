import React, { useState, useEffect } from 'react';
import styles from "../components/SignupNavbar.module.css";

const SignupNavbar = ({ onSelect }) => {
  const [selected, setSelected] = useState('User');
  const [showSuperAdmin, setShowSuperAdmin] = useState(false);
  const SUPER_ADMIN_SHORTCUT = {
    ctrl: true,
    shift: false,
    key: "s"
  };
  
  const handleSelect = (value) => {
    setSelected(value);
    if(onSelect){
      onSelect(value);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.ctrlKey === SUPER_ADMIN_SHORTCUT.ctrl &&
        event.shiftKey === SUPER_ADMIN_SHORTCUT.shift &&
        event.key.toLowerCase() === SUPER_ADMIN_SHORTCUT.key
      ) {
        event.preventDefault();
        setShowSuperAdmin(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
        Employee
      </div>

      {showSuperAdmin && (
        <div
          className={`${styles.button} ${
            selected === "SuperAdmin" ? styles.active : ""
          } ${styles.superAdmin}`}
          onClick={() => handleSelect("SuperAdmin")}
        >
          ADMIN
        </div>
      )}
    </nav>
  );
}

export default SignupNavbar;
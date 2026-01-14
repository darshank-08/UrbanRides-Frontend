import React, { useState } from "react";
import styles from "./Renter.module.css";
import Hamburger from "../components/Hamburger";

const Renter = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.main}>

      <div className={styles.navigation}>

        {/* HAMBURGER → ONLY WHEN NAV CLOSED */}
        {!open && (
          <Hamburger onClick={() => setOpen(true)} />
        )}

        {/* NAV CONTENT */}
        <div
          className={`${styles.navigationContent} ${
            open ? styles.show : ""
          }`}
        >
          <div className={styles.navHeader}>
            <h2>RENT</h2>

            {/* CLOSE → ONLY INSIDE NAV */}
            <span
              className={styles.close}
              onClick={() => setOpen(false)}
            >
              ✕
            </span>
          </div>

          <ul className={styles.navMenu}>
            <li>Available Cars</li>
            <li>My Orders</li>
            <li>Favorites</li>
            <li>Support</li>
          </ul>
        </div>
      </div>

      <div className={styles.content}>523566</div>
    </div>
  );
};

export default Renter;

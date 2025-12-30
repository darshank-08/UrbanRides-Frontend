import React from "react";
import styles from "./Home.module.css";
import Navbar from "../components/Navbar.Jsx";

const Home = () => {
  return (
    <>
      <main className={styles.home}>

        {/* Hero section */}
        <div className={styles.hero}>

          <Navbar />
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
            URBAN RIDES
          </h1>

          <p className={styles.heroText}>
            Book verified cars instantly with transparent pricing and zero hassle.
          </p>
          </div>
        </div>

        <div className={styles.Home}>

        </div>

      </main>

    </>
  );
};

export default Home;

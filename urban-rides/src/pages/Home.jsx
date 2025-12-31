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

        {/* Gap section */}
        <section className={styles.gapSection}>
          <h2 className={styles.gapTitle}>
            One Platform. Two <span className={styles.gapTextItalic}>Possibilities</span>.
          </h2>

          <p className={styles.gapText}>
            Rent your desired car or list your own car and start earning effortlessly.
          </p>
        </section>

        {/* Options section */}
        <section className={styles.optionsSection}>
          <div className={styles.optionBox}>
            <div className={styles.renter}>
              <h3 className={styles.optionTitle}>Renter</h3>
              <div className={styles.optionImgRenter}></div>
              <p className={styles.discripion}>Book verified cars instantly with transparent pricing and zero hassle</p>
            </div>

            <div className={styles.owner}>
              <h3 className={styles.optionTitle}>Owner</h3>
              <div className={styles.optionImgOwner}></div>
              <p className={styles.discripion}>List your own car and start earning effortlessly. Get fair pricing for your vehicle.</p>
            </div>
          </div>
        </section>

        <section className={styles.WhyUsSection}>
          <h2 className={styles.WhyUsTitle}>Why Choose Urban Rides?</h2>
          <p className={styles.WhyUsText}>
            At Urban Rides, we prioritize your convenience and satisfaction. Our platform offers a seamless experience for both renters and owners, ensuring that you have access to reliable vehicles and fair pricing. Join us today and discover the difference!
          </p>

          {/* Auto‑scrolling row */}
          <div className={styles.scrollContainer}>
            <div className={styles.scrollContent}>
              <div className={styles.item}>
                <p>TRUSTED SUPPORT</p>
              </div>
              <div className={styles.item}>

                <p>INSTANT BOOKINGS</p>
              </div>
              <div className={styles.item}>
                <p>100% VERIFIED CARS</p>
              </div>

              {/* duplicate set for seamless loop */}
              <div className={styles.item}>
                <p>EARN EFFORTLESSLY</p>
              </div>
              <div className={styles.item}>
                <p>SEAMLESS EXPRIENCE</p>
              </div>
              <div className={styles.item}>
                <p>PREMIUM, PRICED RIGHT</p>
              </div>
            </div>
          </div>

        </section>
        

      </main>

    </>
  );
};

export default Home;

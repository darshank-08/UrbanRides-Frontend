import React from "react";
import styles from "./Home.module.css";
import Navbar from "../components/Navbar.Jsx";
import Creta from "../assets/Car_Creta.png";
import Virtus from "../assets/Car_Virtus.png";
import Swift from "../assets/Car_Swift.png"; 


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

        {/* How It Works Section */}
        <section className={styles.howItWorks}>
          <h2 className={styles.sectionTitle}>How Urban Rides Works !</h2>
          <p className={styles.sectionSubtitle}>
            A simple process designed for both renters and car owners
          </p>

          <div className={styles.flowsContainer}>

            {/* RENTER FLOW */}
            <div className={styles.flowCard}>
              <h3 className={styles.flowTitle}>For Renters</h3>

              <div className={styles.stepsRow}>
                <div className={styles.step}>
                  <span>1</span>
                  <p>Renter</p>
                </div>
                <div className={styles.line}></div>

                <div className={styles.step}>
                  <span>2</span>
                  <p>Select</p>
                </div>
                <div className={styles.line}></div>

                <div className={styles.step}>
                  <span>3</span>
                  <p>Book</p>
                </div>
                <div className={styles.line}></div>

                <div className={styles.step}>
                  <span>4</span>
                  <p>Drive</p>
                </div>
              </div>
            </div>

            {/* OWNER FLOW */}
            <div className={styles.flowCard}>
              <h3 className={styles.flowTitle}>For Owners</h3>

              <div className={styles.stepsRow}>
                <div className={styles.step}>
                  <span>1</span>
                  <p>Owner</p>
                </div>
                <div className={styles.line}></div>

                <div className={styles.step}>
                  <span>2</span>
                  <p>List</p>
                </div>
                <div className={styles.line}></div>

                <div className={styles.step}>
                  <span>3</span>
                  <p>Verify</p>
                </div>
                <div className={styles.line}></div>

                <div className={styles.step}>
                  <span>4</span>
                  <p>Earn</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Highlight Strip */}
        <section className={styles.highlightStrip}>
          <div className={styles.highlightContent}>
            <h3>Drive Smarter <span className={styles.gapTextItalic}>or</span> Earn Better.</h3>
          </div>
        </section>



        {/* Why Us section */}
        <section className={styles.WhyUsSection}>
          <h2 className={styles.WhyUsTitle}>Why Choose Urban Rides?</h2>
          <p className={styles.WhyUsText}>
            At Urban Rides, we prioritize your convenience and satisfaction. Our platform
            offers a seamless experience for both renters and owners, ensuring reliable
            vehicles and fair pricing.
          </p>

          {/* Middle – Sample Car Preview */}
          <div className={styles.previewSection}>
            <div className={styles.carCard}>
              <img src={Swift} alt="Swift" />
              <h4>Swift</h4>
              <span>₹1,800 / day</span>
            </div>

            <div className={styles.carCard}>
              <img src={Creta} alt="Creta" />
              <h4>Creta</h4>
              <span>₹3,000 / day</span>
            </div>

            <div className={styles.carCard}>
              <img src={Virtus} alt="Virtus" />
              <h4>Virtus</h4>
              <span>₹2,200 / day</span>
            </div>
          </div>
        </section>

        {/* Gap section */}
        <section className={styles.gapSection2}>
          <div className={styles.scrollContainer}>
            <div className={styles.scrollContent}>
              <div className={styles.item}><p>TRUSTED SUPPORT</p></div>
              <div className={styles.item}><p>INSTANT BOOKINGS</p></div>
              <div className={styles.item}><p>100% VERIFIED CARS</p></div>

          
              <div className={styles.item}><p>SEAMLESS EXPRIENCE</p></div>
              <div className={styles.item}><p>PREMIUM, FAIRLY PRICED</p></div>
              <div className={styles.item}><p>EARN EFFORTLESSLY</p></div>
            </div>
          </div> 
        </section>

      </main>

    </>
  );
};

export default Home;

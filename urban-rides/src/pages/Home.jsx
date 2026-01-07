import React from "react";
import { Link } from "react-router-dom";
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
          <h2 className={styles.sectionTitle}>How Urban Rides Works!</h2>
          <p className={styles.sectionSubtitle}>
            A simple process designed for both renters and car owners
          </p>

          <div className={styles.flowsContainer}>

            {/* RENTER FLOW */}
            <div className={styles.flowCard}>
              <div className={styles.titleWrap}>
                <h3 className={styles.flowTitle}>For Renters</h3>
                <svg
                  className={styles.titleSvg}
                  viewBox="0 0 300 120"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className={styles.circlePath}
                    d="M40,70
                      C70,20 230,20 260,60
                      C275,90 140,115 60,90
                      C100,60 230,35 280,45"
                  />
                </svg>
              </div>

              <div className={styles.stepsRow}>
                <div className={styles.step}><span>1</span><p>Renter</p></div>
                <div className={styles.line}></div>
                <div className={styles.step}><span>2</span><p>Select</p></div>
                <div className={styles.line}></div>
                <div className={styles.step}><span>3</span><p>Book</p></div>
                <div className={styles.line}></div>
                <div className={styles.step}><span>4</span><p>Drive</p></div>
              </div>
            </div>

            {/* OWNER FLOW */}
            <div className={styles.flowCard}>
              <div className={styles.titleWrap}>
                <h3 className={styles.flowTitle}>For Owners</h3>
                <svg
                  className={styles.titleSvg}
                  viewBox="0 0 300 120"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className={styles.circlePath}
                    d="M40,70
                      C70,20 230,20 260,60
                      C275,90 140,115 60,90
                      C50,82 100,65 190,50"
                  />
                </svg>
              </div>

              <div className={styles.stepsRow}>
                <div className={styles.step}><span>1</span><p>Owner</p></div>
                <div className={styles.line}></div>
                <div className={styles.step}><span>2</span><p>List</p></div>
                <div className={styles.line}></div>
                <div className={styles.step}><span>3</span><p>Verify</p></div>
                <div className={styles.line}></div>
                <div className={styles.step}><span>4</span><p>Earn</p></div>
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
          <h2 className={styles.WhyUsTitle}>Why Choose{" "}
            <span className={styles.UnderlineWrap}>
              Urban Rides
              <svg
                className={styles.UnderlineSvg}
                viewBox="0 0 200 50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className={styles.UnderlinePath}
                  d="M5,35 C60,45 150,25 190,35"
                />
              </svg>
            </span>
            ?
          </h2>

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

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>
            Ready to get started with Urban Rides?
          </h3>
          <p className={styles.ctaText}>
            Join as a renter or list your car in minutes.
          </p>

          <div className={styles.ctaButtons}>
            <Link to="/login"><button className={styles.primaryBtn}>Explore Cars</button></Link>
            <Link to="/login"><button className={styles.secondaryBtn}>List Your Car</button></Link>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerTop}>

            {/* Left Side */}
            <div className={styles.footerLinks}>

              <div className={styles.linkColumn}>
                <h4>Quick Links</h4>
                <ul>
                  <li>Home</li>
                  <li>About Us</li>
                  <li>Why Urban Rides</li>
                  <li>Contact</li>
                </ul>
              </div>

              <div className={styles.linkColumn}>
                <h4>Services</h4>
                <ul>
                  <li>Rent a Car</li>
                  <li>List Your Car</li>
                  <li>Owner Dashboard</li>
                  <li>Support</li>
                </ul>
              </div>

            </div>

            {/* Right Side */}
            <div className={styles.footerBrand}>
              <h2 className={styles.brandLogo}>URBAN RIDES</h2>

              <div className={styles.newsletterBox}>
                <p className={styles.brandText}>
                  STAY IN THE LOOP WITH OUR WEEKLY NEWSLETTER
                </p>

                <div className={styles.newsletter}>
                  <input type="email" placeholder="Enter your email" />
                  <button aria-label="Subscribe">→</button>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom */}
          <div className={styles.footerBottom}>
            © 2026 Urban Rides. All rights reserved.
          </div>
        </footer>


      </main>

    </>
  );
};

export default Home;

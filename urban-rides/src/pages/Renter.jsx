import React, { useState, useEffect } from "react";  
import styles from "./Renter.module.css";
import Hamburger from "../components/Hamburger";
import CarCard from "../components/CarCard.jsx";

const Renter = () => {
  const [open, setOpen] = useState(false);
  const [cars, setCars] = useState([]);      
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/Renter/active-cars", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        console.log(token);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCars(data);  
      } catch (err) {
        console.error("Failed to fetch cars:", err);
        setError("Could not load car data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);  

  if (loading) return <p className={styles.loading}>Loading cars…</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.main}>

      {/* Navigation Section */}
      <div className={styles.navigation}>
        {!open && <Hamburger onClick={() => setOpen(true)} />}
        <div
          className={`${styles.navigationContent} ${open ? styles.show : ""}`}
        >
          <div className={styles.navHeader}>
            <h2>RENT</h2>
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

      {/* Content Section */}
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>Available Cars</h2>
          <p>Choose the perfect ride for your journey.</p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Location"
            className={styles.input}
          />

          <select className={styles.select}>
            <option value="">Price</option>
            <option value="0-2000">Below 2000</option>
            <option value="2000-3000">2000 – 3000</option>
            <option value="3000+">3000+</option>
          </select>

          <select className={styles.select}>
            <option value="">Seats</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6+">6+</option>
          </select>

          <select className={styles.select}>
            <option value="">Brand</option>
            <option value="Hyundai">Hyundai</option>
            <option value="BMW">BMW</option>
            <option value="Toyota">Toyota</option>
          </select>
        </div>

        {/* Cars Rendering */}
        <div className={styles.cardsWrapper}>
          {cars && cars.length > 0 ? (
            cars.map((car) => <CarCard key={car.id} car={car} />)
          ) : (
            <p>No cars available right now. </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Renter;
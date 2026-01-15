import React, { useState, useEffect } from "react";  
import styles from "./Renter.module.css";
import Hamburger from "../components/Hamburger";
import CarCard from "../components/CarCard.jsx";
import { useNavigate } from 'react-router-dom';

const Renter = () => {
  const [open, setOpen] = useState(false);
  const [cars, setCars] = useState([]);      
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [seats, setSeats] = useState("");
  const [brand, setBrand] = useState("");


  const navigate = useNavigate();

  const API = {
    testAPI : "http://localhost:8080/Renter/active-cars",
    prodAPI : "https://urban-rides-production.up.railway.app/Renter/active-cars"
  }

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(API.testAPI, {
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

    // Filters

    // 1 - by prize
    const filterByPrice = (car) => {
      if (!priceRange) return true; 

      const price = car.pricePerDay;

      if (priceRange === "0-2000") return price < 2000;
      if (priceRange === "2000-3000") return price >= 2000 && price <= 3000;
      if (priceRange === "3000-5000") return price > 3000 && price <= 5000;
      if (priceRange === "5000+") return price > 5000;

      return true;
    };

    // 2 - by seats
    const filterBySeats = (car) => {
      if (!seats) return true;

      if (seats === "4") return car.seats === 4;
      if (seats === "5") return car.seats === 5;
      if (seats === "6+") return car.seats >= 6;

      return true;
    };


    // 3 - by brands
    const filterByBrand = (car) => {
      if (!brand) return true;
      return car.company.toLowerCase().includes(brand.toLowerCase());
    };

    // => All filter
    const filteredCars = cars.filter(
      (car) =>
        car.location.toLowerCase().includes(location.toLowerCase()) &&
        car.company.toLowerCase().includes(brand.toLowerCase()) &&  
        filterByPrice(car) &&
        filterBySeats(car)
    );

  // Navigation
  
  const goToAvailableCars = () => {
    setOpen(false); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


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
            <li onClick={goToAvailableCars}>Available Cars</li>
            <li>My Bookings</li>
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
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <select
            className={styles.select}
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Price</option>
            <option value="0-2000">Below 2000</option>
            <option value="2000-3000">2000 - 3000</option>
            <option value="3000-5000">3000 - 5000</option>
            <option value="5000+">5000+</option>
          </select>

          <select
            className={styles.select}
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
          >
            <option value="">Seats</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6+">6+</option>
          </select>

          <input
            type="text"
            placeholder="Brand (e.g. BMW)"
            className={styles.input}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

        </div>

        {/* Cars Rendering */}
        <div className={styles.cardsWrapper}>
          {filteredCars && filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))
          ) : (
            <p>No cars available right now.</p>
          )}
        </div>


      </div>
    </div>
  );
};

export default Renter;
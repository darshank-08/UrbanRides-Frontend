import React, { useState, useEffect } from "react";
import styles from "./Owner.module.css";
import Hamburger from "../components/Hamburger";
import { useNavigate } from "react-router-dom";

const Owner = () => {
  const [open, setOpen] = useState(false);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const API = {
    testAPI: "http://localhost:8080/Owner/cars",
    prodAPI: "https://urban-rides-production.up.railway.app/Owner/cars",
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(API.testAPI, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cars");
        }

        const data = await response.json();
        console.log("Owner cars:", data);
        setCars(data); // ✅ sirf cars array set karo
      } catch (err) {
        console.error(err);
        setError("Could not load your cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const goToAddCar = () => {
    setOpen(false);
    navigate("/Owner/Add-Cars");
  };

  if (loading) return <p className={styles.loading}>Loading cars...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.main}>
      {/* NAV */}
      <div className={styles.navigation}>
        {!open && <Hamburger onClick={() => setOpen(true)} />}

        <div className={`${styles.navigationContent} ${open ? styles.show : ""}`}>
          <div className={styles.navHeader}>
            <h2>OWNER</h2>
            <span className={styles.close} onClick={() => setOpen(false)}>
              ✕
            </span>
          </div>

          <ul className={styles.navMenu}>
            <li onClick={() => setOpen(false)}>My Cars</li>
            <li onClick={goToAddCar}>Add New Car</li>
          </ul>
        </div>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        <h2 className={styles.contentHeader}>Owner Dashboard</h2>
        {cars.length === 0 ? (
          <p>No cars listed yet</p>
        ) : (
          <div className={styles.carGrid}>
            {cars.map((car) => {
              const imageUrl = car.images && car.images.length > 0 ? car.images[0] : null; 

              return (
                <div key={car.id} className={styles.carCard}>
                  {imageUrl ? (
                    <img src={imageUrl} alt={car.model} />
                  ) : (
                    <div className={styles.noImage}>No image</div>
                  )}

                  <h3>
                    {car.company} {car.model}
                  </h3>
                  <p>₹{car.pricePerDay} / day</p>
                  <button onClick={() => navigate(`/owner/car/${car.id}`)}>
                    Manage
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Owner;
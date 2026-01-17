import React, { useEffect, useState } from "react";
import styles from "../pages/CarDetails.module.css";
import { useParams } from "react-router-dom";

const CarDetails = () => {
  const { carId } = useParams();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API = {
    testAPI: `http://localhost:8080/Renter/car/${carId}`,
    prodAPI: `https://urban-rides-production.up.railway.app/Renter/car/${carId}`,
  };

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        if (!carId) return;

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
          throw new Error("Failed to fetch car details");
        }

        const data = await response.json();
        console.log("CAR DETAILS:", data);

        setDetails(data.carDetails); // ✅ FIX
      } catch{
        setError("Unable to load car details");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);


    const nextImage = () => {
    setCurrentIndex((prev) =>
        prev === details.images.length - 1 ? 0 : prev + 1
    );
    };

    const prevImage = () => {
    setCurrentIndex((prev) =>
        prev === 0 ? details.images.length - 1 : prev - 1
    );
    };


  if (loading) return <p className={styles.loading}>Loading car details…</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!details) return null;

  return (
    <div className={styles.main}>

        {/* LEFT IMAGE */}
        <div className={styles.img}>
        <img
            src={`/images/${details.images[currentIndex]}`}
            alt={`${details.company} ${details.model}`}
        />

        {details.images.length > 1 && (
            <>
            <button className={styles.prevBtn} onClick={prevImage}>
                ‹
            </button>

            <button className={styles.nextBtn} onClick={nextImage}>
                ›
            </button>
            </>
        )}
    </div>


        {/* RIGHT CONTENT */}
        <div className={styles.content}>

            <h1 className={styles.title}>
                {details.company} {details.model}
            </h1>

            <p className={styles.sub}>
                {details.location} • {details.seats} Seater • {details.year}
            </p>

            {/* PRICE */}
            <div className={styles.priceSection}>
                <span className={styles.price}>₹{details.pricePerDay}</span>
                <span className={styles.perDay}> / day</span>
            </div>

            <hr className={styles.divider} />

            {/* SPECS */}
            <div className={styles.specs}>
                <div><span>Fuel</span><p>{details.fuelType}</p></div>
                <div><span>Transmission</span><p>{details.transmission}</p></div>
                <div><span>Mileage</span><p>{details.approxMileage} km/l</p></div>
                <div><span>Condition</span><p>{details.condition}</p></div>
            </div>

             {/* ACTIONS */}
            <div className={styles.actions}>
                <button className={styles.bookBtn}>Book Now</button>
                <button className={styles.saveBtn}>Save</button>
            </div>

            {/* FEATURES */}
            <div className={styles.features}>
                {details.features.map((f, i) => (
                    <span key={i}>{f}</span>
                ))}
            </div>

        </div>
    </div>


  );
};

export default CarDetails;

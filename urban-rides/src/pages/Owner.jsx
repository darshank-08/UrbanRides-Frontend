import React, { useState, useEffect } from "react";
import styles from "./Owner.module.css";
import Hamburger from "../components/Hamburger";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const Owner = () => {
  const [open, setOpen] = useState(false);
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("ALL");

  const navigate = useNavigate();

  const API = {
    test: "http://localhost:8080/Owner/cars",
    prod: "https://urban-rides-production.up.railway.app/Owner/cars",
  };

  // Fetch all cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(API.test, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error();

        const data = await response.json();
        setCars(data);
        setFilteredCars(data);
      } catch (err) {
        console.error("Failed to fetch cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Filter based on status
  useEffect(() => {
    if (view === "ALL") {
      setFilteredCars(cars);
      console.log(cars);  
    } else if (view === "ACTIVE") {
      setFilteredCars(cars.filter(car => car.status === "ACTIVE"));
      console.log(cars);
    } else if (view === "PENDING") {
      setFilteredCars(cars.filter(car => car.status === "PENDING_APPROVAL"));
      console.log(cars);
    } else if (view === "REJECTED") {
      setFilteredCars(cars.filter(car => car.status === "REJECT"));
      console.log(cars);
    }
  }, [view, cars]);

  

  const deleteClickHandler = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    const deleteAPI = {
      test: `http://localhost:8080/Owner/car/${carId}`,
      prod: `https://urban-rides-production.up.railway.app/car/${carId}`,
    } 

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        deleteAPI.test,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      setCars(prev => prev.filter(car => car.id !== carId));
      alert("Car deleted successfully");
    } catch {
      alert("Can't delete. Active bookings exist.");
    }
  };

  const logoutHandler = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    navigate("/login");
  }

  const user = localStorage.getItem("user");

    const profileHandler = () => {
    navigate("/Profile");
  };

  if (loading) return <p className={styles.loading}>Loading cars...</p>;

  return (
    <div className={styles.main}>
      {/* NAV */}
      <div className={styles.navigation}>
        {!open && <Hamburger onClick={() => setOpen(true)} />}

        <div className={`${styles.navigationContent} ${open ? styles.show : ""}`}>
          <div className={styles.navHeader}>
            <h2>OWNER</h2>
            <span onClick={() => setOpen(false)}>✕</span>
          </div>

          <hr style={{maxWidth:"80%"}}/>

          <ul className={styles.navMenu}>
            <li onClick={() => { setView("ALL"); setOpen(false); }}>
              My Cars
            </li>

            <li onClick={() => navigate("/Owner/Add-Cars")}>
              Add New Car
            </li>

            <li onClick={() => { setView("PENDING"); setOpen(false); }}>
              Pending Cars
            </li>

            <li onClick={() => { setView("REJECTED"); setOpen(false); }}>
              Rejected Cars
            </li>

            <hr style={{maxWidth:"80%"}}/>

          <div className={styles.navFooter}>
            <ul className={styles.navFooterMenu}> 
              <li className={styles.navFooterprofile}
              onClick={profileHandler}>
                <FaUserCircle />

                <div className={styles.profilePreview}>
                  <div className={styles.profilePreviewName}>{user}</div>
                  <div className={styles.profilePreviewEdit} onClick={profileHandler}>Edit profile</div>
                </div>
              </li>

              <li className={styles.navFooterlogout} onClick={logoutHandler}>
                <FiLogOut />
                <span>logout</span>
              </li>

            </ul>
          </div>

          </ul>
        </div>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        <h2>
          {view === "ALL" && "All Cars"}
          {view === "ACTIVE" && "Active Cars"}
          {view === "PENDING" && "Pending Cars"}
          {view === "REJECTED" && "Rejected Cars"}
        </h2>

        {filteredCars.length === 0 ? (
          <p>No cars found</p>
        ) : (
          <div className={styles.carGrid}>
            {filteredCars.map(car => (
              <div key={car.id} className={styles.carCard}>
                {car.images?.[0] ? (
                  <img src={car.images[0]} alt={car.model} />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}

                <h3>{car.company} {car.model}</h3>
                <p>₹{car.pricePerDay} / day</p>
                <p>Status: {car.status}</p>

                <div className={styles.carCardButtons}>
                  <button
                    className={styles.updateBtn}
                    disabled={car.status !== "ACTIVE"}
                    onClick={() =>
                      navigate(`/Owner/Update-Car/${car.id}`, {
                        state: { car },
                      })
                    }
                  >
                    Update
                  </button>

                  <button
                    className={styles.deleteBtn}
                    disabled={car.status !== "ACTIVE"}
                    onClick={() => deleteClickHandler(car.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Owner


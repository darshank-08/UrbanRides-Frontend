import React, { useState, useEffect } from "react";
import styles from "./Renter.module.css";
import Hamburger from "../components/Hamburger";
import CarCard from "../components/CarCard.jsx";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const Renter = () => {
  const [open, setOpen] = useState(false);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [seats, setSeats] = useState("");
  const [brand, setBrand] = useState("");
  const [myBookings, setMyBookings] = useState();
  const [bookingClick, setBookingClick] = useState(false);

  const Name = localStorage.getItem("user")
  console.log(Name)

  const navigate = useNavigate();

  const API = {
    testAPI: "http://localhost:8080/Renter/active-cars",
    prodAPI: "https://urban-rides-production.up.railway.app/Renter/active-cars",
  };

  const myBookingAPI = {
    testAPI: "http://localhost:8080/Renter/my-Bookings",
    prodAPI: "https://urban-rides-production.up.railway.app/Renter/my-Bookings",
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(API.testAPI, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setCars(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(myBookingAPI.testAPI, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error();
        const data = await response.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered = Array.isArray(data.body)
          ? data.body.filter((b) => {
              const start = new Date(b.startDate);
              start.setHours(0, 0, 0, 0);
              return start >= today;
            })
          : [];

        setMyBookings(filtered);
        console.log(data.body)
      } catch (err) {}
    };
    fetchBookings();
  }, []);

  const filterByPrice = (car) => {
    if (!priceRange) return true;
    const price = car.pricePerDay;
    if (priceRange === "0-2000") return price < 2000;
    if (priceRange === "2000-3000") return price >= 2000 && price <= 3000;
    if (priceRange === "3000-5000") return price > 3000 && price <= 5000;
    if (priceRange === "5000+") return price > 5000;
    return true;
  };

  const filterBySeats = (car) => {
    if (!seats) return true;
    if (seats === "4") return car.seats === 4;
    if (seats === "5") return car.seats === 5;
    if (seats === "6+") return car.seats >= 6;
    return true;
  };

  const filterByBrand = (car) => {
    if (!brand) return true;
    return car.company.toLowerCase().includes(brand.toLowerCase());
  };

  const filteredCars = cars.filter(
    (car) =>
      car.location.toLowerCase().includes(location.toLowerCase()) &&
      filterByBrand(car) &&
      filterByPrice(car) &&
      filterBySeats(car)
  );

  const handleMyBookingsClick = () => {
    setOpen(false);
    setBookingClick(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToAvailableCars = () => {
    setOpen(false);
    setBookingClick(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logoutHandler = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    navigate("/login");
  };

  const onCardClick = (carId) => {
    navigate(`/cars/${carId}`);
  };

  const user = localStorage.getItem("user");

  const profileHandler = () => {
    navigate("/Profile");
  };

  if (loading) return <p className={styles.loading}>Loading cars…</p>;
  if (error) return <p className={styles.error}>Cars are not available.</p>;

  return (
    <div className={styles.main}>
      <div className={styles.navigation}>
        {!open && <Hamburger onClick={() => setOpen(true)} />}
        <div className={`${styles.navigationContent} ${open ? styles.show : ""}`}>
          <div className={styles.navHeader}>
            <h2>RENT</h2>
            <span className={styles.close} onClick={() => setOpen(false)}>✕</span>
          </div>

          <ul className={styles.navMenu}>
            <li onClick={goToAvailableCars}>Available Cars</li>
            <li onClick={handleMyBookingsClick}>My Bookings</li>
          </ul>

          <div className={styles.navFooter}>
            <ul className={styles.navFooterMenu}>
              <li className={styles.navFooterprofile} onClick={profileHandler}>
                <FaUserCircle />
                <div className={styles.profilePreview}>
                  <div className={styles.profilePreviewName}>{user}</div>
                  <div className={styles.profilePreviewEdit}>Edit profile</div>
                </div>
              </li>

              <li className={styles.navFooterlogout} onClick={logoutHandler}>
                <FiLogOut />
                <span>logout</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          {bookingClick ? <h2>My Bookings</h2> : <h2>Available Cars</h2>}
          {!bookingClick && <p>Choose the perfect ride for your journey.</p>}
        </div>

        {!bookingClick && (
          <div className={styles.filters}>
            <input type="text" placeholder="Location" className={styles.input} value={location} onChange={(e) => setLocation(e.target.value)} />
            <select className={styles.select} value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
              <option value="">Price</option>
              <option value="0-2000">Below 2000</option>
              <option value="2000-3000">2000 - 3000</option>
              <option value="3000-5000">3000 - 5000</option>
              <option value="5000+">5000+</option>
            </select>
            <select className={styles.select} value={seats} onChange={(e) => setSeats(e.target.value)}>
              <option value="">Seats</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6+">6+</option>
            </select>
            <input type="text" placeholder="Brand (e.g. BMW)" className={styles.input} value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
        )}

        {bookingClick ? (
          myBookings && myBookings.length > 0 ? (
            <div className={styles.cardsWrapper}>
              {myBookings.map((booking) => (
                <div key={booking.id} className={styles.bookingCard}>
                  <h3>Renter: {Name}</h3>
                  <p>Booking ID: {booking.id}</p>
                  <p>From: {new Date(booking.startDate).toLocaleDateString()}</p>
                  <p>To: {new Date(booking.endDate).toLocaleDateString()}</p>
                  <p>Total Price: ₹{booking.totalPrice}</p>
                  <p>Status: {booking.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.cardsWrapper}>
              <p>No bookings available right now.</p>
            </div>
          )
        ) : (
          <div className={styles.cardsWrapper}>
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onClick={() => onCardClick(car.id)}
                />
              ))
            ) : (
              <p>No cars available right now.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Renter;

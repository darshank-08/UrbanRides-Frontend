import React, { useEffect, useState } from "react";
import styles from "../pages/CarDetails.module.css";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CarDetails = () => {
  const { carId } = useParams();

  // Car details 
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Booked dates
  const [busyDates, setBusyDates] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);

  // Booking Payloads & states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const navigate = useNavigate();

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  //Building API for CAR details 
  const API = {
    testAPI: `http://localhost:8080/Renter/car/${carId}`,
    prodAPI: `https://urban-rides-production.up.railway.app/Renter/car/${carId}`,
  };

  // Parses "YYYY-MM-DD" into a local Date
  const parseYMD = (s) => {
    if (!s) return null;
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  // Converts a Date object into local date for backend payload
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  //fetching car details
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

        if (!response.ok) throw new Error("Failed to fetch car details");

        const data = await response.json();
        setDetails(data.carDetails);
        setBusyDates(data.bookedDates || []);
      } catch {
        setError("Unable to load car details");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  //Image handling => next & previos
  const nextImage = () => {
    if (!details?.images?.length) return;
    setCurrentIndex((prev) => (prev === details.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!details?.images?.length) return;
    setCurrentIndex((prev) => (prev === 0 ? details.images.length - 1 : prev - 1));
  };

  //Updating Busy Dates at real time
  useEffect(() => {
    const temp = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    temp.push(new Date(yesterday));
    temp.push(new Date(today));

    busyDates.forEach((range) => {
      const start = parseYMD(range.startDate);
      const end = parseYMD(range.endDate);
      if (!start || !end) return;

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        temp.push(new Date(d));
      }
    });

    setDisabledDates(temp);
    setStartDate(null);
    setEndDate(null);
  }, [busyDates]);


  //COD limit Setting
  const COD_LIMIT = 10000;

  const totalDays =
    startDate && endDate
      ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      : 0;

  const totalPrice = totalDays * (details?.pricePerDay || 0);
  const codAllowed = totalPrice <= COD_LIMIT;

  const today = new Date().toISOString().split("T")[0];

  const BookingAPI = {
    testAPI: `http://localhost:8080/Renter/booking/${carId}`,
    prodAPI: `https://urban-rides-production.up.railway.app/Renter/booking/${carId}`,
  };

  //Creating Bookings
  const BookingClick = async () => {
    if (bookingLoading) return;

    if (!startDate || !endDate || !paymentMethod) {
      alert("Please fill all booking information first");
      return;
    }

    const payload = {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      paymentMethod,
    };

    try {
      setBookingLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(BookingAPI.testAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Booking failed");

      setBusyDates((prev) => [
        ...prev,
        { startDate: payload.startDate, endDate: payload.endDate },
      ]);

      //preparing for next booking
      setStartDate(null);
      setEndDate(null);
      setPaymentMethod(null);

      //navigating according to payment method
      if (paymentMethod === "UPI") navigate("/UPI");
      if (paymentMethod === "COD") navigate("/Bill");
    } catch (err) {
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  //Error & Loading handling
  if (loading) return <p className={styles.loading}>Loading car details…</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!details) return null;

  return (
    <div className={styles.main}>
      {/* IMG & Actions */}
      <div className={styles.imgAction}>
        <div className={styles.img}>
          <img
            src={`/images/${details.images[currentIndex]}`}
            alt={`${details.company} ${details.model}`}
          />

          {details.images.length > 1 && (
            <>
              <button className={styles.prevBtn} onClick={prevImage}>‹</button>
              <button className={styles.nextBtn} onClick={nextImage}>›</button>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.bookBtn}
            onClick={BookingClick}
            disabled={bookingLoading}
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Car Details */}
        <h1 className={styles.title}>
          {details.company} {details.model}
        </h1>

        <p className={styles.sub}>
          {details.location} • {details.seats} Seater • {details.year}
        </p>

        <div className={styles.priceSection}>
          <span className={styles.price}>₹{details.pricePerDay}</span>
          <span className={styles.perDay}> / day</span>
        </div>

        <hr className={styles.divider} />

        <div className={styles.bookingBox}>
          <h3>Available dates</h3>
          <div className={styles.dateGroup}>
            <label>Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              excludeDates={disabledDates}
              minDate={new Date(todayDate.getTime() + 24 * 60 * 60 * 1000)}
              dateFormat="dd/MM/yyyy"
              placeholderText={today}
            />
          </div>

          <div className={styles.dateGroup}>
            <label>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              excludeDates={disabledDates}
              minDate={
                startDate
                  ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                  : new Date(todayDate.getTime() + 24 * 60 * 60 * 1000)
              }
              dateFormat="dd/MM/yyyy"
              placeholderText={today}
            />
          </div>
        </div>

        <div className={styles.paymentBox}>
          <h3>Payment Method</h3>

          <label className={styles.radio}>
            <input
              type="radio"
              name="payment"
              value="COD"
              disabled={!codAllowed}
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery (COD)
          </label>

          {!codAllowed && (
            <p className={styles.codMsg}>
              *COD is only available for up to ₹10,000 max.
            </p>
          )}

          <label className={styles.radio}>
            <input
              type="radio"
              name="payment"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI
          </label>
        </div>

        <hr className={styles.divider} />

        <div className={styles.specs}>
          <div>
            <span>Fuel</span>
            {!details.fuelType && <p>N/A</p>}
            <p>{details.fuelType}</p>
          </div>
          <div>
            <span>Transmission</span>
            {!details.transmission && <p>N/A</p>}
            <p>{details.transmission}</p>
          </div>
          <div>
            <span>Mileage</span>
            {!details.approxMileage && <p>N/A</p>}
            <p>{details.approxMileage} km/l</p>
          </div>
          <div>
            <span>Condition</span>
            {!details.condition && <p>N/A</p>}
            <p>{details.condition}</p>
          </div>
        </div>

        {details.features && details.features.length > 0 && (
          <div className={styles.features}>
            {details.features.map((f, i) => (
              <span key={i}>{f}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDetails;
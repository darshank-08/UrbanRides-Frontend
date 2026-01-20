import { useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "./Bill.module.css";

const Bill = () => {
  const { state } = useLocation();
  const booking = state?.booking;


  if (!booking) {
    return (
      <div className={styles.error}>
        <h2>No booking data found</h2>
      </div>
    );
  }

  return (
    <div className={styles.invoiceWrapper}>
      <div className={styles.invoiceCard}>

        {/* Header */}
        <div className={styles.invoiceHeader}>
          <div>
            <h1>Urban Rides</h1>
            <p>Car Rental Invoice</p>
          </div>
          <div className={styles.invoiceMeta}>
            <p><span>Invoice ID: </span>{booking.bookingId}</p>
            <p><span>Date: </span>{booking.createdAt.split("T")[0]}</p>
          </div>
        </div>

        <hr />

        {/* Car Details */}
        <div className={styles.section}>
          <h3>Car Details</h3>
          <div className={styles.row}>
            <span>Car</span>
            <span>
              {booking.car.company} {booking.car.model} ({booking.car.year})
            </span>
          </div>
        </div>

        {/* Rental Details */}
        <div className={styles.section}>
          <h3>Rental Period</h3>
          <div className={styles.row}>
            <span>Start Date</span>
            <span>{booking.rentalPeriod.startDate}</span>
          </div>
          <div className={styles.row}>
            <span>End Date</span>
            <span>{booking.rentalPeriod.endDate}</span>
          </div>
          <div className={styles.row}>
            <span>Total Days</span>
            <span>{booking.rentalPeriod.totalDays}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className={styles.section}>
          <h3>Pricing</h3>
          <div className={styles.row}>
            <span>Price / Day</span>
            <span>₹{booking.pricing.pricePerDay}</span>
          </div>
          <hr className={styles.hr} />
          <div className={`${styles.row} ${styles.total}`}>
            <span>Total Amount</span>
            <span>₹{booking.pricing.totalAmount}</span>
          </div>
        </div>

        {/* Payment */}
        <div className={styles.section}>
          <h3>Payment</h3>
          <div className={styles.row}>
            <span>Method</span>
            <span style={{fontWeight:"bold" , fontSize:"1rem"}}>{booking.payment.method}</span>
          </div>
          <div className={`${styles.row} ${styles.status}`}>
            <span>Status</span>
            <span>{booking.status}</span>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.invoiceFooter}>
          <p>Thank you for choosing <strong>Urban Rides</strong>.</p>
          <button onClick={() => window.print()}>Download Invoice</button>
        </div>

      </div>
    </div>
  );
};

export default Bill;
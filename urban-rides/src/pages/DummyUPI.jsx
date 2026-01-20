import React from 'react'
import style from './DummyUPI.module.css'
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const DummyUPI = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!state) return <h2>No payment data</h2>;

  const { booking, amount } = state;

  const handlePayment = () => {
    setLoading(true);

    setTimeout(() => {
      // Dummy payment success
      booking.payment.status = "SUCCESS";
      booking.payment.transactionId = "UPI" + Date.now();
      booking.status = "CONFIRMED";

      console.log(amount)

      navigate("/Bill", {
        state: { booking },
      });
    }, 2000);
  };

  return (
    <div className={style.upiWrapper}>
      <div className={style.upiCard}>
        <h2>UPI Payment</h2>

        <p><strong>Amount:</strong> ₹{amount}</p>
        <p><strong>UPI ID:</strong> urbanrides@upi</p>

        <button onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <p className={style.note}>* This is a dummy UPI payment</p>
      </div>
    </div>
  );
};

export default DummyUPI;

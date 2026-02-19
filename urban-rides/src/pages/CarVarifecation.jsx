import React, { useState, useEffect } from "react";
import styles from "./CarVarifecation.module.css";
import { useParams, useNavigate } from "react-router-dom";

const CarVarifecation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingCarDetails, setLoadingCarDetails] = useState(true);
  const [carDetails, setCarDetails] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchCarDetails = async () => {
      setLoadingCarDetails(true);
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:8080/Employee/car/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch car details", res.status);
          setCarDetails(null);
          return;
        }

        const data = await res.json();
        console.log("raw data:", data);

        setCarDetails(data.carDetails);
        setBookedDates(data.bookedDates ?? []);
      } catch (e) {
        console.error(e);
        setCarDetails(null);
      } finally {
        setLoadingCarDetails(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const formatCreatedAt = (iso) => {
    if (!iso) return "-";
    const dt = new Date(iso);
    const date = dt.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = dt.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${date} • ${time}`;
  };


  const prevImage = () => {
    if (!carDetails?.images?.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? carDetails.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    if (!carDetails?.images?.length) return;
    setCurrentIndex((prev) =>
      prev === carDetails.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loadingCarDetails) {
    return <div className={styles.loading}>Loading car details...</div>;
  }

  if (!carDetails) {
    return (
      <div className={styles.error}>
        Car not found or error fetching data.
      </div>
    );
  }

  const isPending = carDetails.status === "PENDING_APPROVAL";

  return (
    <div className={styles.wrapper}>
      {/* Navbar */}
      <nav className={styles.topBar}>
        <div className={styles.carName}>
          <span className={styles.carTitle}>
            {carDetails.company} {carDetails.model}
          </span>
        </div>

        <div className={styles.owner}>
          <ul className={styles.metaList}>
            <li>
              Owner:{" "}
              <span className={styles.metaStrong}>
                {carDetails.ownerName}
              </span>
            </li>
            <li>Submitted: {formatCreatedAt(carDetails.createdAt)}</li>
          </ul>
        </div>

        <div className={styles.status}>
          <span
            className={`${styles.statusBadge} ${
              isPending ? styles.statusPending : styles.statusApproved
            }`}
          >
            {isPending ? "PENDING" : "APPROVED"}
          </span>
        </div>
      </nav>

      {/* IMG & Actions */}
      <div className={styles.imgAction}>
        <div className={styles.img}>
          {carDetails.images && carDetails.images.length > 0 ? (
            <>
              <img
                src={carDetails.images[currentIndex]}
                alt={`${carDetails.company} ${carDetails.model}`}
              />

              {carDetails.images.length > 1 && (
                <>
                  <button className={styles.prevBtn} onClick={prevImage}>
                    <span>‹</span>
                  </button>
                  <button className={styles.nextBtn} onClick={nextImage}>
                    <span>›</span>
                  </button>
                </>
              )}
            </>
          ) : (
            <div className={styles.noImage}>
              No image available
            </div>
          )}
        </div>
      </div>

      {/* car details */}
      <div className={styles.vehicleInfoCard}>
        <h2 className={styles.vehicleInfoTitle}>Vehicle Information</h2>

        <hr className={styles.vehicleInfoDivider} />

        <div className={styles.vehicleInfoGrid}>
          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Brand</span>
            <span className={styles.vehicleInfoValue}>{carDetails.company}</span>
          </div>

          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Model</span>
            <span className={styles.vehicleInfoValue}>{carDetails.model}</span>
          </div>

          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Year</span>
            <span className={styles.vehicleInfoValue}>{carDetails.year}</span>
          </div>

          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Fuel Type</span>
            <span className={styles.vehicleInfoValue}>{carDetails.fuelType}</span>
          </div>

          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Transmission</span>
            <span className={styles.vehicleInfoValue}>{carDetails.transmission}</span>
          </div>

          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Seating Capacity</span>
            <span className={styles.vehicleInfoValue}>{carDetails.seats}</span>
          </div>

          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Condition</span>
            <span className={styles.vehicleInfoValue}>
              {carDetails.condition ?? "-"}
            </span>
          </div>
        </div>
      </div>

      {/* user info */}
      <div className={styles.vehicleInfoCard}>
        <span className={styles.ownerLabel}>* Visit for more information</span><br />
        <span>{carDetails.ownerName}</span><br />
      </div>

      {/* Review Decision */}
      <div className={styles.reviewCard}>
        <h2 className={styles.reviewTitle}>Review Decision</h2>
        <p className={styles.reviewSubtitle}>
          *Review all details carefully before making a decision
        </p>

        <div className={styles.reviewActions}>
          <button
            type="button"
            className={styles.approveBtn}
          >
            <span>✓</span>
            <span>Approve Car</span>
          </button>

          <button
            type="button"
            className={styles.rejectBtn}
          >
            <span>✕</span>
            <span>Reject Car</span>
          </button>
        </div>

        <p className={styles.reviewNote}>
          By approving, you confirm all details have been verified.
        </p>
      </div>
    </div>
  );
};

export default CarVarifecation;
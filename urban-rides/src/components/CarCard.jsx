import React from "react";
import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import styles from "./CarCard.module.css";

const CarCard = ({ car, onClick }) => {
  const imageUrl = car.heroImg || car.images?.[0] || null;
  const statusLabel = car.status || "Available";

  const featureTags = [
    ...(car.features || []),
    car.seats ? `${car.seats} Seats` : null,
    car.approxMileage ? `${car.approxMileage} kmpl` : null
  ].filter(Boolean);

  return (
    <div className={styles.card} onClick={() => onClick?.(car)}>
      <div className={styles.imageWrapper}>
        <div
          className={styles.image}
          style={{
            backgroundImage: imageUrl ? `url("${imageUrl}")` : "none",
          }}
        />

        <span className={styles.statusBadge}>{statusLabel}</span>

        <button
          type="button"
          className={styles.favBtn}
          onClick={(e) => e.stopPropagation()}
        >
          <FaHeart />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h4 className={styles.title}>
            {car.company} {car.model}
          </h4>

          {car.ownerName && (
            <span className={styles.owner}>by {car.ownerName}</span>
          )}
        </div>

        <p className={styles.meta}>
          {[car.year, car.fuelType, car.transmission]
            .filter(Boolean)
            .join(" • ")}
        </p>

        {featureTags.length > 0 && (
          <div className={styles.tags}>
            {featureTags.slice(0, 3).map((feature) => (
              <span key={feature} className={styles.tag}>
                {feature}
              </span>
            ))}

            {featureTags.length > 3 && (
              <span className={styles.moreTag}>
                +{featureTags.length - 3} more
              </span>
            )}
          </div>
        )}

        {car.location && (
          <div className={styles.locationRow}>
            <FaMapMarkerAlt className={styles.locationIcon} />
            <span>{car.location}</span>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.priceBlock}>
            <span className={styles.price}>
              ₹
              {car.pricePerDay?.toLocaleString?.("en-IN") ??
                car.pricePerDay}
            </span>
            <span className={styles.perDay}>/day</span>
          </div>

          <button
            type="button"
            className={styles.rentBtn}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(car);
            }}
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
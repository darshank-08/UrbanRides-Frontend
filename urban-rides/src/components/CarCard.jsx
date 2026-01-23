import styles from "./CarCard.module.css";

const CarCard = ({ car, onClick }) => {
  const imageUrl = car.images?.[0]; 
  return (
    <div className={styles.card} onClick={onClick}>
      <div
        className={styles.image}
        style={{
          backgroundImage: imageUrl ? `url("${imageUrl}")` : "none",
        }}
      />
      <div className={styles.content}>
        <h4>
          {car.company} {car.model}
        </h4>
        <p>
          {car.location} • {car.seats} Seats
        </p>
        <strong>₹{car.pricePerDay} / day</strong>
      </div>
    </div>
  );
};

export default CarCard;
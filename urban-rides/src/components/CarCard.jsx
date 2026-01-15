import styles from "./CarCard.module.css";

const CarCard = ({ car }) => {
  return (
    <div className={styles.card}>
      <div
        className={styles.image}
        style={{
          backgroundImage: `url(http://localhost:8080/images/cars/${car.images?.[0]})`,
        }}
      />
      <div className={styles.content}>
        <h4>
          {car.company} {car.model}
        </h4>
        <p>
          {car.location} • {car.seats} Seats
        </p>
        <strong>₹{car.pricePerDay} / day</strong>
      </div>
    </div>
  );
};

export default CarCard; 
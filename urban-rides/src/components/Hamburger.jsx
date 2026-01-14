import styles from "./Hamburger.module.css";

const Hamburger = ({ onClick }) => {
  return (
    <button className={styles.hamburger} onClick={onClick}>
      <span>☰</span>
    </button>
  );
};

export default Hamburger;

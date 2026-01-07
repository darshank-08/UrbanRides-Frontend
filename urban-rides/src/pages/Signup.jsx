import styles from "./Signup.module.css";

const Signup = () => {
  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupCard}>

        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>
          Join Urban Rides and start your journey
        </p>

        <form className={styles.form}>
          <input type="text" placeholder="Full Name" className={styles.input} />

          <input type="email" placeholder="Email Address" className={styles.input} />

          <input type="password" placeholder="Password" className={styles.input} />

          <input type="password" placeholder="Confirm Password" className={styles.input} />

          <button type="submit" className={styles.signupBtn}>
            Sign Up
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account? <a href="/login">Login</a>
        </div>

      </div>
    </div>
  );
};

export default Signup;

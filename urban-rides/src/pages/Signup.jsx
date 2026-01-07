import styles from "./Signup.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    fullName: "",
    username: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  
  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "mobile" && !/^\d*$/.test(value)) return;

  setData({
    ...data,
      [name]: value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !data.fullName ||
      !data.username ||
      !data.mobile ||
      !data.password ||
      !data.confirmPassword
    ) {
      setErrorMessage("All fields are required");
      return;
    }


    if (!/^[0-9]{10}$/.test(data.mobile)) {
      setErrorMessage("Mobile number must be 10 digits");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    const payload = {
      fullName: data.fullName.trim(),
      userName: data.username.trim(),           
      phoneNumber: Number(data.mobile.trim()),
      password: data.password
    };



    try {

      const testApi = "http://localhost:8080/sign-in/owner";
      const ProdApi = "https://urban-rides-production.up.railway.app/api/auth/register";

      const res = await fetch( testApi,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      let result = {};
      
      try {
        result = await res.json();
      } catch {
        result = {};
      }


      if (!res.ok) {
        setErrorMessage(result.message || "Signup failed");
        return;
      }

      navigate("/login");

    } catch {
      setErrorMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupCard}>

        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>
          Join Urban Rides and start your journey
        </p>

        {errorMessage && (
          <p className={styles.error}>{errorMessage}</p>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>

          {/* BASIC INFO */}
          <input type="text" name="fullName" placeholder="Full Name" className={styles.input} value={data.fullName} onChange={handleChange}/>

          <input type="text" name="username" placeholder="Username" className={styles.input} value={data.username} onChange={handleChange}/>

          <input type="tel" name="mobile" placeholder="10-digit Mobile Number" className={styles.input} value={data.mobile} onChange={handleChange} maxLength="10"/>

          {/* PASSWORD GROUP */}
          <div className={styles.passwordGroup}>
            <input type="password" name="password" placeholder="Password" className={styles.input} value={data.password} onChange={handleChange}/>

            <input type="password" name="confirmPassword" placeholder="Confirm Password" className={styles.input} value={data.confirmPassword} onChange={handleChange}/>
          </div>

          <button
            type="submit"
            className={styles.signupBtn}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
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

import styles from "./Signup.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupNavbar from "../components/SignupNavbar.jsx"

const Signup = () => {
  const navigate = useNavigate();

   const [role, setRole] = useState("User");
   const [userType, setUserType] = useState("Renter");


  const [data, setData] = useState({
    fullName: "",
    username: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
    console.log(errorMessage)

  
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

    const userAPI ={
       testApi : "http://localhost:8080/sign-in/",
       ProdApi : "https://urban-rides-production.up.railway.app/api/auth/register"
    }

    const adminAPI ={
       testApi : "http://localhost:8080/sign-in/admin",
       ProdApi : "https://urban-rides-production.up.railway.app/api/auth/register"
    }

    let payload;
    let testAPI;
    let prodAPI;

    if (role === "User") {
      payload = {
        fullName: data.fullName.trim(),
        userName: data.username.trim(),
        phoneNumber: Number(data.mobile.trim()),
        password: data.password
      };

      if(userType === "Renter"){
        testAPI = userAPI.testApi + "renter";
        prodAPI = userAPI.ProdApi + "renter";
      }else if(userType === "Owner"){
        testAPI = userAPI.testApi + "owner";
        prodAPI = userAPI.ProdApi + "owner";
      }

      
    } else {
      payload = {
        adminFullName: data.fullName.trim(),
        adminName: data.username.trim(),
        adminNumber: Number(data.mobile.trim()),
        adminPass: data.password
      };

      testAPI = adminAPI.testApi;
      prodAPI = adminAPI.ProdApi;
    }


    try {

      const res = await fetch(testAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let result = {};
      try {
        result = await res.json(); 
      } catch (err) {
        console.error("JSON parse error", err);
        result = {};
      }

      if (!res.ok) {
        if (result.code === "USERNAME_TAKEN") {
          setErrorMessage("Username already taken! Choose another.");
        } else {
          setErrorMessage(result.message || "Something went wrong");
        }
        return;
      }

      if(role === "User"){
        navigate("/login");
        alert("Sign up successfull. Log in to continue")
      }else{
        alert("Please wait for approval from Super-Admin")
      }


    } catch {
      setErrorMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupWrapper}>

      <SignupNavbar onSelect={setRole} />
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
          <p className={styles.input}><span style={{color: "#7e7c7c"}}>Selected Role : </span>{role}</p>

          {role === "User" && (
            <div className={styles.radioGroup}>
              <label>
                <input type="radio" name="userType" value="Renter" onChange={(e) => setUserType(e.target.value)}/>
                Renter
              </label>

              <label>
                <input type="radio" name="userType" value="Owner" onChange={(e) => setUserType(e.target.value)}/>
                Owner
              </label>
            </div>
          )}
        

          {role === "Admin" && (
            <p className={styles.input}>Note : <span style={{color: "#7e7c7c"}}>You have to wait for approval from Super-Admin</span></p>
          )}

          <input type="text" name="fullName" placeholder="Full Name" className={styles.input} value={data.fullName} onChange={handleChange}/>

          <input type="text" name="username" placeholder="Username" className={styles.input} value={data.username} onChange={handleChange}/>

          <input type="tel" name="mobile" placeholder="Mobile Number" className={styles.input} value={data.mobile} onChange={handleChange} maxLength="10"/>

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

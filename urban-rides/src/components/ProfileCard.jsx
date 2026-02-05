import React, { useEffect, useState } from "react";
import styles from "./ProfileCard.module.css";

const ProfileCard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    gender: "",
    phoneNumber: "",
    fullName: ""
  });

  const userName = localStorage.getItem("user");
  const roles = JSON.parse(localStorage.getItem("roles")) || [];

  const isRenter = roles.includes("ROLE_RENTER");
  const isOwner = roles.includes("ROLE_OWNER");
  const isEmp = roles.includes("ROLE_EMP");

  const API = {
    OWNER: { test: "http://localhost:8080/Owner/user",
             prod: "https://urban-rides-production.up.railway.app/Owner/user"
           },
    RENTER: { testAPI: `http://localhost:8080/Renter/user/${userName}`,
              prod : `https://urban-rides-production.up.railway.app/Renter/user/${userName}`
            },
    EMPLOYEE: { test: "http://localhost:8080/Employee/user",
                prod: "https://urban-rides-production.up.railway.app/Employee/user"
            },
    ADMIN: { test: "http://localhost:8080/Admin/user",
             prod: "https://urban-rides-production.up.railway.app/Admin/user"
            }
  };

  const updateAPI ={

    OWNER: { test: "http://localhost:8080/Owner/update",
             prod: "https://urban-rides-production.up.railway.app/Owner/update"
           },
    RENTER: { testAPI: `http://localhost:8080/Renter/update`,
              prod : `https://urban-rides-production.up.railway.app/Renter/update`
            },
    EMPLOYEE: { test: "http://localhost:8080/Employee/user",
                prod: "https://urban-rides-production.up.railway.app/Employee/user"
            },
    ADMIN: { test: "http://localhost:8080/Admin/user",
             prod: "https://urban-rides-production.up.railway.app/Admin/user"
            }
  }

  const deleteAPI = {
    OWNER: { test: "http://localhost:8080/Owner/delete",
             prod: "https://urban-rides-production.up.railway.app/Owner/delete"
           },
    RENTER: { testAPI: `http://localhost:8080/Renter/delete`,
              prod : `https://urban-rides-production.up.railway.app/Renter/update`
            },
  }

  let apiUrl = "";
  if (isOwner) apiUrl = API.OWNER.test;
  else if (isRenter) apiUrl = API.RENTER.testAPI;
  else if (isEmp) apiUrl = API.EMPLOYEE.test;
  else apiUrl = API.ADMIN.test;

  let updateURI = "";
  if (isOwner) updateURI = updateAPI.OWNER.test;
  else if (isRenter) updateURI = updateAPI.RENTER.testAPI;
  else if (isEmp) updateURI = updateAPI.EMPLOYEE.test;
  else updateURI = updateAPI.ADMIN.test;

  let deleteURI = "";
  if (isOwner) deleteURI = deleteAPI.OWNER.test;
  else if (isRenter) deleteURI = deleteAPI.RENTER.testAPI;
  // else if (isEmp) updateURI = updateAPI.EMPLOYEE.test;
  // else updateURI = updateAPI.ADMIN.test;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Fetch failed");

        const data = await response.json();
        setUserInfo(data);

        if (data?.profileImageUrl) {
          setPreview(data.profileImageUrl);
        }

        console.log(data);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [apiUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const toggleEdit = async () => {
    if (isEditing) {

      try {
      const payload = {};

      if (formData.fullName !== userInfo.fullName && formData.fullName !== "") {
        payload.fullName = formData.fullName;
      }
      if (formData.gender !== userInfo.gender && formData.gender !== "") {
        payload.gender = formData.gender;
      }
      if (formData.phoneNumber !== userInfo.phoneNumber && formData.phoneNumber !== "") {
        payload.phoneNumber = formData.phoneNumber;
      }

      if (Object.keys(payload).length === 0) {
        setIsEditing(false);
        alert("Nothing to update");
        return;
      }
        const token = localStorage.getItem("token");

        console.log("Sending Payload:", payload);

      const res = await fetch(updateURI, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          console.error("Failed to update profile");
          return;
        }

        setUserInfo((prev) => ({
          ...prev,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber
        }));

        setIsEditing(false);
      } catch (error) {
        console.error("Error saving profile", error);
      }
    } else {
      setIsEditing(true);
    }
  };

  const photoPicker = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8080/profile/upload-profile-photo",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const imageUrl = await res.text(); 
      console.log("Uploaded URL:", imageUrl);

      setPreview(imageUrl);

    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed");
    }
  };

  const deleteHandler = async () => {
    if (isEmp) {
      alert("Employee cannot delete for now");
      return;
    }

    let password = prompt("Enter password");

    if (password === null || password.trim() === "") {
      alert("Password not entered");
      return;
    }

    const sure = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!sure) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(deleteURI, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: password,
        }),
      });

      const data = await res.json().catch(() => null)

      console.log(data.code)

      if (!res.ok) {
        if (data?.code === "RENTER_BOOKING_EXISTS") {
          alert("You cannot delete account while car is currently rented or upcoming booking exists.");
          return;
        } else if(data?.code === "OWNER_BOOKING_EXISTS"){
          alert("You cannot delete account while your car has booking or upcoming booking.")
        }

        alert(data?.message || `Failed to delete account (${res.status})`);
        return;
      }

      alert("Account deleted successfully");

      // cleanup yahan
      // localStorage.clear();
      // window.location.href = "/login";
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting account");
    }
  };


  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.profileWrapper}>
      {/* TOP SECTION */}
      <div className={styles.topSection}>
        <div className={styles.profileHeader}>
          <div className={styles.profilePhoto}>
            <label className={styles.photoPicker}>
              {preview ? <img src={preview} alt="profile" /> : <span>+</span>}
              <input type="file" accept="image/*" onChange={photoPicker} />
            </label>
          </div>

          <div className={styles.profileContent}>
            <h2 className={styles.profileName}>
              {userInfo?.fullName || "Guest User"}
            </h2>
            <p className={styles.profileUsername}>
              @{userInfo?.userName || "guest_user"}
            </p>

            <div className={styles.roleRow}>
              <p>Role: </p>
              {userInfo?.roles?.map((role, index) => (
                <span key={index} className={styles.roleBadge}>
                  {role.replace("ROLE_", "")}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.profileActions}>
          {/* Button Toggles between Edit and Save */}
          <button 
            className={`${styles.edit} ${isEditing ? styles.primary : styles.secondary}`} 
            onClick={toggleEdit}
          >
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>
          
          <button className={styles.delete} onClick={deleteHandler}>
            Delete Account
          </button>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* BOTTOM SECTION */}
      <div className={styles.bottomSection}>
        <div className={styles.infoItem}>
          {isEditing ? (
            <div>
              <span>Full Name: </span>
              <input type="text" 
              className={styles.inputField}
              name="fullName" 
              value={formData.fullName}
              onChange={handleInputChange} />
            </div>
          ) : (
            <div>
              <span>Status</span>
              <p>Active</p>
            </div>
          )}
        </div>

        {/* GENDER SECTION */}
        <div className={styles.infoItem}>
          <span>Gender</span>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <label>
                <input type="radio" name="gender" value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleInputChange}
                /> Male
              </label>
              <label>
                <input type="radio" name="gender" value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleInputChange}
                /> Female
              </label>
            </div>
          ) : (
            <p>{userInfo?.gender || "N/A"}</p>
          )}
        </div>

        {/* PHONE SECTION */}
        <div className={styles.infoItem}>
          <span>Phone</span>
          {isEditing ? (
            <div>
              +91 
              <input type="text" name="phoneNumber" value={formData.phoneNumber}
                onChange={handleInputChange}
                maxLength={10}
                className={styles.inputField} 
              />
            </div>
          ) : (
            <p>+91 {userInfo?.phoneNumber || "N/A"}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
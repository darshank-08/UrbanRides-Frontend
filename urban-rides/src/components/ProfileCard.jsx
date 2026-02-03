import React, { useEffect, useState } from "react";
import styles from "./ProfileCard.module.css";

const ProfileCard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  const userName = localStorage.getItem("user"); 
  const roles = JSON.parse(localStorage.getItem("roles")) || [];

  const isRenter = roles.includes("ROLE_RENTER");
  const isOwner  = roles.includes("ROLE_OWNER");
  const isEmp    = roles.includes("ROLE_EMP");

  const API = {
    OWNER: {
      test: "http://localhost:8080/Owner/user",
      prod: "https://urban-rides-production.up.railway.app/Owner/user",
    },
    RENTER:{
      testAPI : `http://localhost:8080/Renter/user/${userName}`,
      prodAPI : `https://urban-rides-production.up.railway.app/Renter/user/${userName}`
    },
    EMPLOYEE: {
      test: "http://localhost:8080/Employee/user",
      prod: "https://urban-rides-production.up.railway.app/Employee/user",
    },
    ADMIN: {
      test: "http://localhost:8080/Admin/user",
      prod: "https://urban-rides-production.up.railway.app/Admin/user",
    },
  };

  let apiUrl = "";
  if (isOwner) {
    apiUrl = API.OWNER.test;
  } else if (isRenter) {
    apiUrl = API.RENTER.testAPI;
  } else if (isEmp) {
    apiUrl = API.EMPLOYEE.test;
  } else {
    apiUrl = API.ADMIN.test;
  }

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


  if (loading) return <p>Loading...</p>;

  return (
      <div className={styles.profileWrapper}>
        
        {/* TOP SECTION */}
        <div className={styles.topSection}>
          <div className={styles.profileHeader}>
            <div className={styles.profilePhoto}>
              <label className={styles.photoPicker}>
                {preview ? (
                  <img src={preview} alt="profile" />
                ) : (
                  <span>+</span>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={photoPicker}
                />
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
            <button className={`${styles.btn} ${styles.secondary}`}>
              Edit Profile
            </button>
            <button className={`${styles.btn} ${styles.outline}`}>
              Change Password
            </button>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* BOTTOM SECTION */}
        <div className={styles.bottomSection}>

          <div className={styles.infoItem}>
            <span>Status</span>
            <p>Active</p>
          </div>

          <div className={styles.infoItem}>
            <span>Gender</span>
            <p>{userInfo?.gender || "N/A"}</p>
          </div>

          <div className={styles.infoItem}>
            <span>Phone</span>
            <p>+91 {userInfo?.phoneNumber || "N/A"}</p>
          </div>

        </div>

      </div>
  );
};

export default ProfileCard;

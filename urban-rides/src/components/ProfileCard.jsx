import React, { useEffect, useState } from "react";
import styles from "./ProfileCard.module.css";

const ProfileCard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = {
    test: "http://localhost:8080/Owner/user",
    prod: "https://urban-rides-production.up.railway.app/Owner/user",
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        // Ensure you handle the case where token might be null if needed
        const response = await fetch(API.test, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error();

        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      {/* MAIN CARD WRAPPER */}
      <div className={styles.profileWrapper}>
        
        {/* TOP SECTION: Header & Buttons */}
        <div className={styles.topSection}>
          <div className={styles.profileHeader}>
            <h2 className={styles.profileName}>
              {userInfo?.fullName || "Guest User"}
            </h2>
            <p className={styles.profileUsername}>
              @{userInfo?.userName || "guest_user"}
            </p>

            <div className={styles.roleRow}>
              {userInfo?.roles?.map((role, index) => (
                <span key={index} className={styles.roleBadge}>
                  {role.replace("ROLE_", "")}
                </span>
              ))}
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

        {/* BOTTOM SECTION: Info Grid */}
        <div className={styles.bottomSection}>
          <div className={styles.infoItem}>
            <span>Gender</span>
            <p>{userInfo?.gender || "N/A"}</p>
          </div>

          <div className={styles.infoItem}>
            <span>Phone</span>
            <p>{userInfo?.phoneNumber || "N/A"}</p>
          </div>

          <div className={styles.infoItem}>
            <span>Status</span>
            <p>Active</p>
          </div>

          <div className={styles.infoItem}>
            <span>Joined On</span>
            <p>
              {userInfo?.createdAt
                ? new Date(userInfo.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileCard;
import React, { useEffect, useState } from "react";
import styles from "./ProfileCard.module.css";

const ProfileCard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = {
    OWNER: {
      test: "http://localhost:8080/Owner/user",
      prod: "https://urban-rides-production.up.railway.app/Owner/user",
    },
    RENTER: {
      test: "http://localhost:8080/Renter/user",
      prod: "https://urban-rides-production.up.railway.app/Renter/user",
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const roles = JSON.parse(localStorage.getItem("roles")) || [];

        if (!token || roles.length === 0) {
          throw new Error("No auth data");
        }

        // ROLE_OWNER → OWNER
        const roleKey = roles[0].replace("ROLE_", "");

        const apiUrl = API[roleKey]?.test;
        if (!apiUrl) {
          throw new Error("Invalid role API");
        }

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Fetch failed");

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
      <div className={styles.profileWrapper}>
        
        {/* TOP SECTION */}
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

        {/* BOTTOM SECTION */}
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
  );
};

export default ProfileCard;

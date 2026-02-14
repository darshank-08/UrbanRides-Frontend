import React, { useEffect, useState } from "react";
import styles from "./ProfileCard.module.css";

const ProfileCard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const roles = JSON.parse(localStorage.getItem("roles")) || [];
  const userName = localStorage.getItem("user");

  const isRenter = roles.includes("ROLE_RENTER");
  const isOwner = roles.includes("ROLE_OWNER");
  const isEmp = roles.includes("ROLE_EMPLOYEE");

  const [formData, setFormData] = useState({
    gender: "",
    phoneNumber: "",
    fullName: "",
    empNumber: ""
  });

  const API = {
    OWNER: "http://localhost:8080/Owner/user",
    RENTER: `http://localhost:8080/Renter/user/${userName}`,
    EMPLOYEE: "http://localhost:8080/Employee/user",
    ADMIN: "http://localhost:8080/Admin/user",
  };

  const UPDATE = {
    OWNER: "http://localhost:8080/Owner/update",
    RENTER: "http://localhost:8080/Renter/update",
    EMPLOYEE: "http://localhost:8080/Employee/user",
    ADMIN: "http://localhost:8080/Admin/user",
  };

  const DELETE = {
    OWNER: "http://localhost:8080/Owner/delete",
    RENTER: "http://localhost:8080/Renter/delete",
  };

  let apiUrl = isOwner ? API.OWNER : isRenter ? API.RENTER : isEmp ? API.EMPLOYEE : API.ADMIN;
  let updateURI = isOwner ? UPDATE.OWNER : isRenter ? UPDATE.RENTER : isEmp ? UPDATE.EMPLOYEE : UPDATE.ADMIN;
  let deleteURI = isOwner ? DELETE.OWNER : isRenter ? DELETE.RENTER : "";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUserInfo(data);
        if (data?.profileImageUrl) setPreview(data.profileImageUrl);
      } catch (e) {
        console.error(e);
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
      setPreview(imageUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const toggleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const payload = {};
    if (formData.fullName && formData.fullName !== userInfo.fullName) payload.fullName = formData.fullName;
    if (formData.gender && formData.gender !== userInfo.gender) payload.gender = formData.gender;
    if (formData.phoneNumber && formData.phoneNumber !== userInfo.phoneNumber) payload.phoneNumber = formData.phoneNumber;

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    const token = localStorage.getItem("token");
    await fetch(updateURI, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    setUserInfo((p) => ({ ...p, ...payload }));
    setIsEditing(false);
  };

  const deleteHandler = async () => {
    if (isEmp) return alert("Employee cannot delete");
    const password = prompt("Enter password");
    if (!password) return;

    const token = localStorage.getItem("token");
    await fetch(deleteURI, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.profileWrapper}>
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
              {userInfo?.fullName || userInfo?.empFullName || "guest_user"}
            </h2>

            <p className={styles.profileUsername}>
              @{userInfo?.userName || userInfo?.empName || userName}
            </p>

            <div className={styles.roleRow}>
              <p>Role:</p>
              {roles.map((r, i) => (
                <span key={i} className={styles.roleBadge}>
                  {r.replace("ROLE_", "")}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.profileActions}>
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

      <div className={styles.bottomSection}>
        <div className={styles.infoItem}>
          {isEditing ? (
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={styles.inputField}
            />
          ) : (
            <p>Status: Active</p>
          )}
        </div>

        <div className={styles.infoItem}>
          {isEditing ? (
            <>
              <label>
                <input type="radio" name="gender" value="Male" onChange={handleInputChange} /> Male
              </label>
              <label>
                <input type="radio" name="gender" value="Female" onChange={handleInputChange} /> Female
              </label>
            </>
          ) : (
            <p>Gender: {userInfo?.gender || "N/A"}</p>
          )}
        </div>

        <div className={styles.infoItem}>
          {isEditing ? (
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              maxLength={10}
              className={styles.inputField}
            />
          ) : (
            <p>Contact: +91 {userInfo?.phoneNumber || userInfo?.empNumber || "N/A"}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

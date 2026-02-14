import React, { useState, useEffect } from "react";
import styles from "./Employee.module.css";
import Hamburger from "../components/Hamburger";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const Employee = () => {
  const [open, setOpen] = useState(false);

  const [loadingCars, setLoadingCars] = useState(true);
  const [pendingCars, setPendingCars] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]);

  const [view, setView] = useState("PENDING_CARS"); 

  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const PendingCars = {
    test: "http://localhost:8080/Employee/pending-cars",
    prod: "https://urban-rides-production.up.railway.app/pending-cars", 
  };

  const usersList = {
    test: "http://localhost:8080/Employee/Get-Users",
    prod: "https://urban-rides-production.up.railway.app/Employee/Get-Users", 
  };

  useEffect(() => {
    const fetchPendingCars = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(PendingCars.test, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPendingCars(Array.isArray(data) ? data : (data?.pendingCars ?? []));
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingCars(false);
      }
    };
    fetchPendingCars();
  }, []);

  // fetching users only when employee clicks User's List
  useEffect(() => {
    if (view !== "USERS" || users.length > 0) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(usersList.test, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log(data)
        setUsers(Array.isArray(data) ? data : (data?.users ?? []));
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [view]);

  const logoutHandler = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.clear();
    navigate("/login");
  };

  const profileHandler = () => navigate("/profile");

  const formatCreatedAt = (iso) => {
    const dt = new Date(iso);
    const date = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    const time = dt.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
    return `${date} at ${time}`;
  };

  return (
    <div className={styles.main}>
      {/* NAV */}
      <div className={styles.navigation}>
        {!open && <Hamburger onClick={() => setOpen(true)} />}

        <div className={`${styles.navigationContent} ${open ? styles.show : ""}`}>
          <div className={styles.navHeader}>
            <h2 >EMPLOYEE</h2>
            <span onClick={() => setOpen(false)}>✕</span>
          </div>

          <hr style={{ maxWidth: "80%" }} />

          <ul className={styles.navMenu}>
            <li onClick={() => { setView("PENDING_CARS"); setOpen(false); }}>
              Pending Cars
            </li>

            <li onClick={() => { setView("USERS"); setOpen(false); }}>
              User's List
            </li>

            <hr style={{ maxWidth: "80%" }} />

            <div className={styles.navFooter}>
              <ul className={styles.navFooterMenu}>
                <li className={styles.navFooterprofile} onClick={profileHandler}>
                  <FaUserCircle />
                  <div className={styles.profilePreview}>
                    <div className={styles.profilePreviewName}>{user}</div>
                    <div className={styles.profilePreviewEdit}>Edit profile</div>
                  </div>
                </li>

                <li className={styles.navFooterlogout} onClick={logoutHandler}>
                  <FiLogOut />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          </ul>
        </div>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        <div className={styles.carsTitle}>
          {view === "PENDING_CARS" &&
            <h1 className={styles.carsTitle}>
              Pending Cars <br />
              <span>Please review and approve the following cars</span>
            </h1> 
          }
          {view === "USERS" && 
            <h1 className={styles.carsTitle}>
              User's list <br />
            </h1> 
          }
        </div>

        {/* PENDING CARS VIEW */}
        {view === "PENDING_CARS" && (
          <>
            {loadingCars ? (
              <p className={styles.loading}>Loading pending cars...</p>
            ) : pendingCars.length === 0 ? (
              <p>No cars found</p>
            ) : (
              <div className={styles.carGrid}>
                {pendingCars.map((car, idx) => (
                  <div key={car.id ?? idx} className={styles.carCard}>
                    {car.images?.[0] ? (
                      <img src={car.images[0]} alt={car.model} />
                    ) : (
                      <div className={styles.noImage}>No Image</div>
                    )}

                    <div className={styles.carBody}>
                      <h3 className={styles.carCompany}>{car.company} {car.model}</h3>
                      <p className={styles.owner}><span>Owner: </span>{car.ownerName}</p>
                      <p className={styles.owner}><span>Created at: </span>{formatCreatedAt(car.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* USERS VIEW */}
        {view === "USERS" && (
          <>
            {loadingUsers ? (
              <p className={styles.loading}>Loading users...</p>
            ) : users.length === 0 ? (
              <p>No users found</p>
            ) : (
              <div className={styles.userTableWrap}>
                <table className={styles.userTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((u, idx) => (
                      <tr key={u.id ?? idx}>
                        <td className={styles.nameCell}>{u.name ?? u.fullName ?? "-"}</td>
                        <td>{u.roles ?? "-"}</td>
                        <td>+91 {u.phoneNumber ?? "-"}</td>
                        <td>{u.gender ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Employee;
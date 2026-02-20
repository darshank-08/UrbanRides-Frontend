import React, { useState, useEffect, useMemo } from "react";
import styles from "./CarVarifecation.module.css";
import { CgProfile } from "react-icons/cg";
import { MdOutlinePhone } from "react-icons/md";
import { Navigate, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CarVarifecation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingCarDetails, setLoadingCarDetails] = useState(true);
  const [carDetails, setCarDetails] = useState(null);

  const [loadingOwnerInfo, setLoadingOwnerInfo] = useState(true);
  const [ownerInfo, setOwnerInfo] = useState(null);

  const [bookedDates, setBookedDates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loadingApproval, setLoadingApproval] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  const emp = localStorage.getItem("user");

  // Fetch car details
  useEffect(() => {
    if (!id) return;

    const fetchCarDetails = async () => {
      setLoadingCarDetails(true);
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:8080/Employee/car/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch car details", res.status);
          setCarDetails(null);
          return;
        }

        const data = await res.json();
        setCarDetails(data.carDetails);
        console.log("Fetched car details:", data.carDetails);
        setBookedDates(data.bookedDates ?? []);
        setCurrentIndex(0);
      } catch (e) {
        console.error(e);
        setCarDetails(null);
      } finally {
        setLoadingCarDetails(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const owner = useMemo(() => carDetails?.ownerName ?? "", [carDetails]);
  console.log("Owner name from car details:", owner);

  useEffect(() => {
    if (!owner) return;

    const fetchOwnerInfo = async () => {
      setLoadingOwnerInfo(true);
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:8080/Employee/owner/${owner}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch owner info", res.status);
          setOwnerInfo(null);
          return;
        }

        const data = await res.json();
        setOwnerInfo(data);
        console.log("Fetched owner info:", data);
      } catch (e) {
        console.error(e);
        setOwnerInfo(null);
      } finally {
        setLoadingOwnerInfo(false);
      }
    };

    fetchOwnerInfo();
  }, [owner]);

  // Approving Car
  const handleApprove = async () => {
    if (!carDetails) return;
    setLoadingApproval(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/Employee/car-approval/${carDetails.id}/${emp}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingApproval(false);
    }

    alert(`Car has been approved by ${emp}.`);
    navigate("/Employee");
  };

  // Rejecting Car
  const handleReject = async () => {
    if (!carDetails) return;
    setLoadingReject(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/Employee/car-reject/${carDetails.id}/${emp}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReject(false);
    }

    alert(`Car has been rejected by ${emp}.`);
    navigate("/Employee")
  };

  const formatCreatedAt = (iso) => {
    if (!iso) return "-";
    const dt = new Date(iso);
    const date = dt.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = dt.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${date} • ${time}`;
  };

  const prevImage = () => {
    if (!carDetails?.images?.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? carDetails.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    if (!carDetails?.images?.length) return;
    setCurrentIndex((prev) =>
      prev === carDetails.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loadingCarDetails) {
    return <div className={styles.loading}>Loading car details...</div>;
  }

  if (!carDetails) {
    return <div className={styles.error}>Car not found or error fetching data.</div>;
  }

  const isPending = carDetails.status === "PENDING_APPROVAL";

  return (
    <div className={styles.wrapper}>
      {/* Navbar */}
      <nav className={styles.topBar}>
        <div className={styles.carName}>
          <span className={styles.carTitle}>
            {carDetails.company} {carDetails.model}
          </span>
        </div>

        <div className={styles.owner}>
          <ul className={styles.metaList}>
            <li>
              Owner: <span className={styles.metaStrong}>{carDetails.ownerName}</span>
            </li>
            <li>Submitted: {formatCreatedAt(carDetails.createdAt)}</li>
          </ul>
        </div>

        <div className={styles.status}>
          <span
            className={`${styles.statusBadge} ${
              isPending ? styles.statusPending : styles.statusApproved
            }`}
          >
            {isPending ? "PENDING" : "APPROVED"}
          </span>
        </div>
      </nav>

      {/* IMG */}
      <div className={styles.imgAction}>
        <div className={styles.img}>
          {carDetails.images && carDetails.images.length > 0 ? (
            <>
              <img
                src={carDetails.images[currentIndex]}
                alt={`${carDetails.company} ${carDetails.model}`}
              />

              {carDetails.images.length > 1 && (
                <>
                  <button className={styles.prevBtn} onClick={prevImage} type="button">
                    <span>‹</span>
                  </button>
                  <button className={styles.nextBtn} onClick={nextImage} type="button">
                    <span>›</span>
                  </button>
                </>
              )}
            </>
          ) : (
            <div className={styles.noImage}>No image available</div>
          )}
        </div>
      </div>

      {/* Vehicle Info */}
      <div className={styles.vehicleInfoCard}>
        <h2 className={styles.vehicleInfoTitle}>Vehicle Information</h2>
        <hr className={styles.vehicleInfoDivider} />

        <div className={styles.vehicleInfoGrid}>
          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Brand</span>
            <span className={styles.vehicleInfoValue}>{carDetails.company}</span>
          </div>

          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Model</span>
            <span className={styles.vehicleInfoValue}>{carDetails.model}</span>
          </div>

          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Year</span>
            <span className={styles.vehicleInfoValue}>{carDetails.year}</span>
          </div>

          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Fuel Type</span>
            <span className={styles.vehicleInfoValue}>{carDetails.fuelType}</span>
          </div>

          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Transmission</span>
            <span className={styles.vehicleInfoValue}>{carDetails.transmission}</span>
          </div>

          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Seating Capacity</span>
            <span className={styles.vehicleInfoValue}>{carDetails.seats}</span>
          </div>

          <div className={styles.vehicleInfoItem}>
            <span className={styles.vehicleInfoLabel}>Condition</span>
            <span className={styles.vehicleInfoValue}>{carDetails.condition ?? "-"}</span>
          </div>
        </div>
      </div>

      {/* Owner Info card (you named it EMP card but it is Owner info) */}
      <div className={styles.ownerCard}>
        <div className={styles.ownerCardHeader}>
          <h3>Owner Information</h3>
        </div>

        <div className={styles.ownerCardBody}>
          {loadingOwnerInfo ? (
            <p className={styles.empState}>Loading owner info...</p>
          ) : !ownerInfo ? (
            <p className={styles.empState}>Owner info not available</p>
          ) : (
            <>
              <div className={styles.ownerTop}>
                <div className={styles.ownerAvatar}>
                  <CgProfile size={24} />
                </div>

                <div>
                  <div className={styles.vehicleInfoLabel}>Owner Name</div>
                  <div className={styles.vehicleInfoValue}>
                    <span className={styles.ownerNameSpan}>{ownerInfo.fullName ?? "-"}</span>
                  </div>
                </div>
              </div>

              <div className={styles.ownerGrid2}>
                <div className={styles.ownerField}>
                  <MdOutlinePhone size={20} className={styles.ownerFieldIcon} />
                  <span className={styles.ownerFieldText}>
                    +91 {ownerInfo.phoneNumber ?? "-"}
                  </span>
                </div>

                <div className={styles.ownerField}>
                  <span className={styles.ownerFieldText}>
                    @{ownerInfo.userName ?? "-"}
                  </span>
                </div>
              </div>

              <div className={styles.ownerGenderSection}>
                <span className={styles.vehicleInfoLabel}>Gender</span>
                <div className={styles.vehicleInfoValue}>
                  {ownerInfo.gender ?? ownerInfo.location ?? "-"}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Review Decision */}
      <div className={styles.reviewCard}>
        <h2 className={styles.reviewTitle}>Review Decision</h2>

        {carDetails.status === "PENDING_APPROVAL" && 
          <p className={styles.reviewSubtitle}>
            *Review all details carefully before making a decision
          </p>       
        }


        {carDetails.status !== "PENDING_APPROVAL" ? (
          <p className={styles.reviewState}>
            This car has already been{" "}
            {carDetails.status === "ACTIVE" ? "approved" : "rejected"}.
          </p>
        ) : (
          <>
            <div className={styles.reviewActions}>
              <button
                type="button"
                className={styles.approveBtn}
                onClick={handleApprove}
                disabled={loadingApproval || loadingReject}
              >
                <span>✓</span>
                <span>{loadingApproval ? "Approving..." : "Approve Car"}</span>
              </button>

              <button
                type="button"
                className={styles.rejectBtn}
                onClick={handleReject}
                disabled={loadingReject || loadingApproval}
              >
                <span>✕</span>
                <span>{loadingReject ? "Rejecting..." : "Reject Car"}</span>
              </button>
            </div>

            <p className={styles.reviewNote}>
              By approving, you confirm all details have been verified.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CarVarifecation;
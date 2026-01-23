import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import styles from "./AddCar.module.css"; 

const UpdateCar = () => {
  const { id: carId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const initialCar = location.state?.car || null;

  const [data, setData] = useState({
    company: "",
    model: "",
    year: "",
    pricePerDay: "",
    location: "",
    seats: "",
    approxMileage: "",
    condition: "",
    fuelType: "",
    transmission: "",
    features: ""
  });

  // existing data 
  const [existingImages, setExistingImages] = useState([]);
  const [existingDocument, setExistingDocument] = useState("");

  // new uploads
  const [imageFiles, setImageFiles] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [documentFile, setDocumentFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Already present data
  useEffect(() => {
    if (initialCar) {
      setData({
        company: initialCar.company || "",
        model: initialCar.model || "",
        year: initialCar.year != null ? String(initialCar.year) : "",
        pricePerDay:
          initialCar.pricePerDay != null
            ? String(initialCar.pricePerDay)
            : "",
        location: initialCar.location || "",
        seats: initialCar.seats != null ? String(initialCar.seats) : "",
        approxMileage:
          initialCar.approxMileage != null
            ? String(initialCar.approxMileage)
            : "",
        condition: initialCar.condition || "",
        fuelType: initialCar.fuelType || "",
        transmission: initialCar.transmission || "",
        features:
          Array.isArray(initialCar.features) && initialCar.features.length > 0
            ? initialCar.features.join(", ")
            : ""
      });

      setExistingImages(initialCar.images || []);
      setExistingDocument(initialCar.document || "");
      setHeroIndex(0);
    }
  }, [initialCar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setHeroIndex(0);
  };

  const handleDocumentChange = (e) => {
    setDocumentFile(e.target.files[0] || null);
  };

  // File upload helper
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:8080/Owner/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    });

    if (!res.ok) {
      throw new Error("File upload failed");
    }

    const url = await res.text();
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let finalImageUrls = existingImages;

      if (imageFiles.length > 0) {
        const orderedFiles = [
          imageFiles[heroIndex],
          ...imageFiles.filter((_, idx) => idx !== heroIndex)
        ];

        finalImageUrls = await Promise.all(
          orderedFiles.map((file) => uploadFile(file))
        );
      }

      let finalDocumentUrl = existingDocument;

      if (documentFile) {
        finalDocumentUrl = await uploadFile(documentFile);
      }

      const payload = {
        company: data.company,
        model: data.model,
        year: Number(data.year),
        pricePerDay: Number(data.pricePerDay),
        location: data.location,
        seats: Number(data.seats),
        approxMileage: Number(data.approxMileage),
        condition: data.condition,
        fuelType: data.fuelType,
        transmission: data.transmission,
        features: data.features
          ? data.features.split(",").map((f) => f.trim()).filter(Boolean)
          : [],
        images: finalImageUrls,
        document: finalDocumentUrl
      };

      const API = {
        test: `http://localhost:8080/Owner/update-car/${carId}`,
        prod: `https://urban-rides-production.up.railway.app/Owner/update-car/${carId}`
      };

      const res = await fetch(API.test, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Failed to update car");
        return;
      }

      alert("Car updated successfully.");
      navigate("/Owner");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while updating car");
    } finally {
      setLoading(false);
    }
  };

  if (!initialCar) {
    return (
      <p className={styles.error}>No car data. Try opening from Owner page.</p>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2>Update Car</h2>
        <p>
          This is your current car. Update details only if something has
          changed.
        </p>

        {/* Current car summary */}
        <div className={styles.currentSummary}>
          <span className={styles.currentSummaryLabel}>Current listing:</span>

          <div className={styles.currentSummaryCard}>
            {existingImages[0] && (
              <img
                src={existingImages[0]}
                alt="Current hero"
                className={styles.currentSummaryImage}
              />
            )}

            <div className={styles.currentSummaryText}>
              <div className={styles.currentSummaryTitle}>
                {initialCar.company} {initialCar.model}
              </div>
              <div className={styles.currentSummaryMeta}>
                {initialCar.location} • {initialCar.seats} seats •{" "}
                {initialCar.year}
              </div>
              <div className={styles.currentSummaryPrice}>
                ₹{initialCar.pricePerDay} / day
              </div>
            </div>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="company"
            placeholder="Company (e.g. Toyota)"
            value={data.company}
            onChange={handleChange}
          />
          <input
            name="model"
            placeholder="Model (e.g. Fortuner)"
            value={data.model}
            onChange={handleChange}
          />
          <input
            type="number"
            name="year"
            placeholder="Manufacturing Year"
            value={data.year}
            onChange={handleChange}
          />
          <input
            type="number"
            name="pricePerDay"
            placeholder="Price per day ₹"
            value={data.pricePerDay}
            onChange={handleChange}
          />
          <input
            name="location"
            placeholder="Car Location"
            value={data.location}
            onChange={handleChange}
          />
          <input
            type="number"
            name="seats"
            placeholder="Seats"
            value={data.seats}
            onChange={handleChange}
          />
          <input
            type="number"
            name="approxMileage"
            placeholder="Mileage (km/l)"
            value={data.approxMileage}
            onChange={handleChange}
          />

          <select
            name="condition"
            value={data.condition}
            onChange={handleChange}
          >
            <option value="">Condition</option>
            <option value="EXCELLENT">Excellent</option>
            <option value="GOOD">Good</option>
            <option value="AVERAGE">Average</option>
          </select>

          <select
            name="fuelType"
            value={data.fuelType}
            onChange={handleChange}
          >
            <option value="">Fuel Type</option>
            <option value="PETROL">Petrol</option>
            <option value="DIESEL">Diesel</option>
            <option value="ELECTRIC">Electric</option>
          </select>

          <select
            name="transmission"
            value={data.transmission}
            onChange={handleChange}
          >
            <option value="">Transmission</option>
            <option value="MANUAL">Manual</option>
            <option value="AUTOMATIC">Automatic</option>
          </select>

          <input
            name="features"
            placeholder="Features (AC, GPS, Airbags)"
            value={data.features}
            onChange={handleChange}
          />

          {/* NEW Images upload (optional) */}
          <div className={styles.uploadGroup}>
            <span className={styles.uploadLabel}>
              Car Images (leave empty to keep existing)
            </span>

            <label className={styles.fileBox} htmlFor="carImages">
              <span className={styles.fileTitle}>Upload new car photos</span>
              <span className={styles.fileHint}>
                If you select new images, old ones will be replaced
              </span>
            </label>

            <input
              id="carImages"
              type="file"
              multiple
              accept="image/*"
              className={styles.fileInput}
              onChange={handleImagesChange}
            />

            {imageFiles.length > 0 && (
              <>
                <p className={styles.fileInfo}>
                  {imageFiles.length} image
                  {imageFiles.length > 1 ? "s" : ""} selected
                </p>

                <div className={styles.previewGrid}>
                  {imageFiles.map((file, idx) => (
                    <div key={idx} className={styles.previewItem}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${idx + 1}`}
                        className={styles.previewImage}
                      />
                      <button
                        type="button"
                        className={
                          idx === heroIndex
                            ? styles.heroButtonActive
                            : styles.heroButton
                        }
                        onClick={() => setHeroIndex(idx)}
                      >
                        {idx === heroIndex ? "Hero image" : "Set as hero"}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Document upload (optional) */}
          <div className={styles.uploadGroup}>
            <span className={styles.uploadLabel}>
              RC / Insurance Document (leave empty to keep existing)
            </span>

            <label className={styles.fileBox} htmlFor="rcDocument">
              <span className={styles.fileTitle}>
                Upload new RC / Insurance PDF
              </span>
              <span className={styles.fileHint}>PDF only</span>
            </label>

            <input
              id="rcDocument"
              type="file"
              accept="application/pdf"
              className={styles.fileInput}
              onChange={handleDocumentChange}
            />

            {documentFile ? (
              <p className={styles.fileInfo}>Selected: {documentFile.name}</p>
            ) : (
              existingDocument && (
                <p className={styles.fileInfo}>
                  Current: {existingDocument.split("/").pop()}
                </p>
              )
            )}
          </div>

          <button disabled={loading}>
            {loading ? "Updating..." : "Update Car"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCar;
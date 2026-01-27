import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ReportForm() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    type: "",
    location: "",
    description: "",
    severity: "info",
    lat: "",
    lng: "",
    affectedPeople: "",
    contactPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Read coordinates from URL if coming from map click
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (lat && lng) {
      setFormData(prev => ({ ...prev, lat, lng }));
    }
  }, [searchParams]);

  const disasterTypes = [
    "Flood",
    "Earthquake",
    "Cyclone",
    "Fire",
    "Landslide",
    "Drought",
    "Tsunami",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
    setSuccess(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }));
        setGeoLoading(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Failed to get location. Please enter coordinates manually.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.type || !formData.location || !formData.description) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const reportData = {
        type: formData.type,
        location: formData.location,
        description: formData.description,
        severity: formData.severity,
        status: "pending",
        timestamp: serverTimestamp(),
      };

      // Add coordinates if provided
      if (formData.lat && formData.lng) {
        reportData.lat = parseFloat(formData.lat);
        reportData.lng = parseFloat(formData.lng);
      }

      // Add optional fields
      if (formData.affectedPeople) {
        reportData.affectedPeople = formData.affectedPeople;
      }
      if (formData.contactPhone) {
        reportData.contactPhone = formData.contactPhone;
      }

      await addDoc(collection(db, "reports"), reportData);

      setSuccess(true);
      setFormData({
        type: "",
        location: "",
        description: "",
        severity: "info",
        lat: "",
        lng: "",
        affectedPeople: "",
        contactPhone: "",
      });
    } catch (err) {
      console.error("Error submitting report:", err);
      setError("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Report Disaster</h1>
        <p className="page-subtitle">Submit a new disaster incident report</p>
      </div>

      <div className="card" style={{ maxWidth: "720px" }}>
        <form className="form" onSubmit={handleSubmit}>
          {success && (
            <div className="message success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
              Report submitted successfully! It will appear on the map once approved.
            </div>
          )}

          {error && (
            <div className="message error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Disaster Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select disaster type</option>
              {disasterTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location Name *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Mumbai, Maharashtra"
              required
            />
          </div>

          {/* Coordinates Section */}
          <div style={{
            background: "var(--bg-elevated)",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px",
            border: "1px solid var(--border-subtle)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                📍 GPS Coordinates (for map display)
              </label>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={geoLoading}
                className="btn btn-secondary"
                style={{ padding: "8px 16px", fontSize: "0.8125rem" }}
              >
                {geoLoading ? (
                  <>
                    <span className="loading-spinner" style={{ width: "14px", height: "14px", marginRight: "8px" }}></span>
                    Getting location...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px" }}>
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="12" y1="2" x2="12" y2="4" />
                      <line x1="12" y1="20" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="4" y2="12" />
                      <line x1="20" y1="12" x2="22" y2="12" />
                    </svg>
                    Use Current Location
                  </>
                )}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <input
                  type="number"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Latitude (e.g., 19.0760)"
                  step="any"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Longitude (e.g., 72.8777)"
                  step="any"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Severity Level</label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="form-select"
            >
              <option value="info">Low - Minor incident</option>
              <option value="warning">Medium - Significant impact</option>
              <option value="critical">High - Critical emergency</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Estimated Affected People</label>
              <input
                type="text"
                name="affectedPeople"
                value={formData.affectedPeople}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 500+"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., +91 9876543210"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Describe the disaster situation, affected areas, and any immediate needs..."
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Submitting..." : "Submit Report"}
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "8px" }}>
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22,2 15,22 11,13 2,9 22,2" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

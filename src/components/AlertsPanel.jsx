import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// SVG Icons
const Icons = {
  critical: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  location: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  clock: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  empty: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  mapPin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
};

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const staticAlerts = [
    {
      id: "1",
      type: "Flood",
      location: "Chennai, Tamil Nadu",
      description: "Heavy flooding reported in low-lying areas. Emergency evacuation in progress.",
      severity: "critical",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      type: "Cyclone",
      location: "Mumbai, Maharashtra",
      description: "Cyclone warning issued. Expected landfall in 12 hours.",
      severity: "warning",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: "3",
      type: "Earthquake",
      location: "Delhi NCR",
      description: "Minor tremors detected. No significant damage reported.",
      severity: "info",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "4",
      type: "Fire",
      location: "Bangalore, Karnataka",
      description: "Industrial fire contained. Fire department on scene.",
      severity: "warning",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      id: "5",
      type: "Flood",
      location: "Kolkata, West Bengal",
      description: "River levels rising rapidly. Alert for riverside communities.",
      severity: "critical",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
  ];

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const q = query(collection(db, "reports"), orderBy("timestamp", "desc"), limit(20));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }));
      setAlerts(data.length > 0 ? data : staticAlerts);
    } catch (error) {
      console.log("Using static alerts:", error.message);
      setAlerts(staticAlerts);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const getSeverityIcon = (severity) => {
    if (severity === "critical") return Icons.critical;
    if (severity === "warning") return Icons.warning;
    return Icons.info;
  };

  if (loading) {
    return (
      <div className="saas-loading-wrap">
        <div className="saas-loading-spinner"></div>
      </div>
    );
  }

  const criticalCount = alerts.filter(a => a.severity === "critical").length;
  const warningCount = alerts.filter(a => a.severity === "warning").length;
  const infoCount = alerts.filter(a => a.severity !== "critical" && a.severity !== "warning").length;

  const filteredAlerts = alerts.filter(a => {
    if (filter === "all") return true;
    if (filter === "critical") return a.severity === "critical";
    if (filter === "warning") return a.severity === "warning";
    if (filter === "info") return a.severity !== "critical" && a.severity !== "warning";
    return true;
  });

  return (
    <div className="alerts-container">
      {/* Subheader and filter bar */}
      <div className="alerts-header-bar">
        <div className="alerts-subtitle-block">
          <p className="alerts-subtitle">
            Real-time emergency broadcast notifications and disaster alerts across operational zones.
          </p>
        </div>

        {/* Severity filter pills */}
        <div className="alerts-filter-pills">
          <button
            type="button"
            className={`alerts-filter-pill ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            type="button"
            className={`alerts-filter-pill critical ${filter === "critical" ? "active" : ""}`}
            onClick={() => setFilter("critical")}
          >
            Critical ({criticalCount})
          </button>
          <button
            type="button"
            className={`alerts-filter-pill warning ${filter === "warning" ? "active" : ""}`}
            onClick={() => setFilter("warning")}
          >
            Warning ({warningCount})
          </button>
          <button
            type="button"
            className={`alerts-filter-pill info ${filter === "info" ? "active" : ""}`}
            onClick={() => setFilter("info")}
          >
            Low / Info ({infoCount})
          </button>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="saas-card">
          <div className="empty-state">
            <div className="empty-state-icon">{Icons.empty}</div>
            <div className="empty-state-title">No active alerts found</div>
            <p>No disaster alerts match the selected filter category.</p>
          </div>
        </div>
      ) : (
        <div className="alerts-list">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="alert-card">
              <div className={`alert-icon ${alert.severity || "info"}`}>
                {getSeverityIcon(alert.severity)}
              </div>
              <div className="alert-content">
                <div className="alert-top-row">
                  <h3 className="alert-title">{alert.type}</h3>
                  <span className={`alert-badge ${alert.severity || "info"}`}>
                    {alert.severity || "info"}
                  </span>
                </div>
                <div className="alert-description">
                  {alert.description || `Field notification reported at ${alert.location}`}
                </div>
                <div className="alert-meta">
                  <span className="alert-meta-item">
                    {Icons.location}
                    <span>{alert.location || "Assigned Sector"}</span>
                  </span>
                  <span className="alert-meta-item">
                    {Icons.clock}
                    <span>{formatTime(alert.timestamp)}</span>
                  </span>
                </div>
              </div>
              <Link to="/map" className="alert-action-btn" title="View on Map">
                {Icons.mapPin}
                <span>View Map</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

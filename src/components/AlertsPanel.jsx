import { useState, useEffect } from "react";
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
      <polyline points="12,6 12,12 16,14" />
    </svg>
  ),
  empty: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
};

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Active Alerts</h1>
        <p className="page-subtitle">Real-time disaster alerts and notifications</p>
      </div>

      {alerts.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">{Icons.empty}</div>
            <div className="empty-state-title">No active alerts</div>
            <p>All clear! No disaster alerts at this time.</p>
          </div>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map(alert => (
            <div key={alert.id} className="alert-card">
              <div className={`alert-icon ${alert.severity || "info"}`}>
                {getSeverityIcon(alert.severity)}
              </div>
              <div className="alert-content">
                <div className="alert-title">{alert.type}</div>
                <div className="alert-description">
                  {alert.description || `Reported at ${alert.location}`}
                </div>
                <div className="alert-meta">
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {Icons.location} {alert.location}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {Icons.clock} {formatTime(alert.timestamp)}
                  </span>
                </div>
              </div>
              <span className={`alert-badge ${alert.severity || "info"}`}>
                {alert.severity || "info"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

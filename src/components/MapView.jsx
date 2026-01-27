import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Static fallback data for when no Firebase reports exist
const staticDisasterData = [
  { id: "s1", lat: 13.0827, lng: 80.2707, type: "Flood", location: "Chennai, Tamil Nadu", severity: "critical", affectedPeople: "15,000+", status: "Active" },
  { id: "s2", lat: 19.076, lng: 72.8777, type: "Cyclone", location: "Mumbai, Maharashtra", severity: "warning", affectedPeople: "8,500+", status: "Monitoring" },
  { id: "s3", lat: 28.6139, lng: 77.209, type: "Earthquake", location: "Delhi NCR", severity: "info", affectedPeople: "500+", status: "Resolved" },
  { id: "s4", lat: 12.9716, lng: 77.5946, type: "Fire", location: "Bangalore, Karnataka", severity: "warning", affectedPeople: "1,200+", status: "Active" },
  { id: "s5", lat: 22.5726, lng: 88.3639, type: "Flood", location: "Kolkata, West Bengal", severity: "critical", affectedPeople: "22,000+", status: "Active" },
  { id: "s6", lat: 17.385, lng: 78.4867, type: "Drought", location: "Hyderabad, Telangana", severity: "warning", affectedPeople: "45,000+", status: "Monitoring" },
];

// Color mapping by disaster TYPE
const getTypeColor = (type) => {
  const colors = {
    Flood: "#3b82f6",      // Blue
    Fire: "#ef4444",       // Red
    Earthquake: "#8b5cf6", // Purple
    Cyclone: "#06b6d4",    // Cyan
    Landslide: "#a16207",  // Brown
    Drought: "#f59e0b",    // Amber
    Tsunami: "#0891b2",    // Teal
    Other: "#6b7280",      // Gray
  };
  return colors[type] || "#6b7280";
};

export default function MapView() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [disasterData, setDisasterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedLocation, setClickedLocation] = useState(null);

  // Fetch reports from Firebase
  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const reports = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          }))
          .filter(report => report.lat && report.lng); // Only include reports with coordinates

        // Use Firebase data if available, otherwise use static data
        if (reports.length > 0) {
          setDisasterData(reports);
        } else {
          setDisasterData(staticDisasterData);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reports:", error);
        setDisasterData(staticDisasterData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Initialize and update map
  useEffect(() => {
    if (loading) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current && mapRef.current) {
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([20.5937, 78.9629], 5);

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Click-to-Report: Click on map to get coordinates
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setClickedLocation({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
      });
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each disaster
    disasterData.forEach(disaster => {
      // Color by disaster TYPE
      const color = getTypeColor(disaster.type);
      const pulseSize = disaster.severity === "critical" ? 40 : 30;

      const icon = L.divIcon({
        className: "custom-marker-container",
        html: `
          <div class="pulse-marker" style="--color: ${color}; --size: ${pulseSize}px;">
            <div class="pulse-ring"></div>
            <div class="pulse-ring delay"></div>
            <div class="marker-dot" style="background: ${color};"></div>
          </div>
        `,
        iconSize: [pulseSize, pulseSize],
        iconAnchor: [pulseSize / 2, pulseSize / 2],
      });

      const marker = L.marker([disaster.lat, disaster.lng], { icon })
        .addTo(mapInstanceRef.current);

      // Popup with disaster details
      const popupContent = `
        <div style="min-width: 180px; font-family: inherit;">
          <strong style="font-size: 14px; color: ${color};">${disaster.type}</strong>
          <div style="font-size: 12px; color: #666; margin: 4px 0;">${disaster.location}</div>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <span style="background: ${disaster.severity === 'critical' ? '#fee2e2' : disaster.severity === 'warning' ? '#fef3c7' : '#dbeafe'}; 
                         color: ${disaster.severity === 'critical' ? '#dc2626' : disaster.severity === 'warning' ? '#d97706' : '#2563eb'};
                         padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
              ${disaster.severity || 'info'}
            </span>
            <span style="background: #f3f4f6; color: #374151; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
              ${disaster.status || 'pending'}
            </span>
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedDisaster(disaster);
        mapInstanceRef.current.flyTo([disaster.lat, disaster.lng], 8, { duration: 1 });
      });

      markersRef.current.push(marker);
    });

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [disasterData, loading]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleReset = () => mapInstanceRef.current?.flyTo([20.5937, 78.9629], 5, { duration: 1 });

  // Navigate to report form with clicked coordinates
  const handleReportFromMap = () => {
    if (clickedLocation) {
      navigate(`/report?lat=${clickedLocation.lat}&lng=${clickedLocation.lng}`);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === "critical") return "#f43f5e";
    if (severity === "warning") return "#f59e0b";
    return "#3b82f6";
  };

  const getStatusLabel = (status) => {
    if (!status) return "Active";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  const stats = {
    total: disasterData.length,
    critical: disasterData.filter(d => d.severity === "critical").length,
    warning: disasterData.filter(d => d.severity === "warning").length,
    info: disasterData.filter(d => d.severity === "info").length,
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="map-view-container">
      {/* Map Panel Info */}
      <div className="map-sidebar">
        <div className="map-sidebar-header">
          <h2>Live Incidents</h2>
          <p>{disasterData.length} active locations</p>
        </div>

        {/* Stats */}
        <div className="map-stats">
          <div className="map-stat">
            <span className="map-stat-value">{stats.critical}</span>
            <span className="map-stat-label">Critical</span>
            <div className="map-stat-bar" style={{ background: "#f43f5e", width: `${(stats.critical / Math.max(stats.total, 1)) * 100}%` }}></div>
          </div>
          <div className="map-stat">
            <span className="map-stat-value">{stats.warning}</span>
            <span className="map-stat-label">Warning</span>
            <div className="map-stat-bar" style={{ background: "#f59e0b", width: `${(stats.warning / Math.max(stats.total, 1)) * 100}%` }}></div>
          </div>
          <div className="map-stat">
            <span className="map-stat-value">{stats.info}</span>
            <span className="map-stat-label">Low</span>
            <div className="map-stat-bar" style={{ background: "#3b82f6", width: `${(stats.info / Math.max(stats.total, 1)) * 100}%` }}></div>
          </div>
        </div>

        {/* Disaster List */}
        <div className="map-disaster-list">
          {disasterData.map(disaster => (
            <div
              key={disaster.id}
              className={`map-disaster-item ${selectedDisaster?.id === disaster.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedDisaster(disaster);
                mapInstanceRef.current?.flyTo([disaster.lat, disaster.lng], 8, { duration: 1 });
              }}
            >
              <div
                className="map-disaster-indicator"
                style={{ background: getSeverityColor(disaster.severity) }}
              ></div>
              <div className="map-disaster-info">
                <div className="map-disaster-type">{disaster.type}</div>
                <div className="map-disaster-location">{disaster.location}</div>
              </div>
              <div className={`map-disaster-status ${(disaster.status || 'active').toLowerCase()}`}>
                {getStatusLabel(disaster.status)}
              </div>
            </div>
          ))}
        </div>

        {/* Legend - By Disaster Type */}
        <div className="map-legend">
          <div className="map-legend-title">Disaster Types</div>
          <div className="map-legend-items">
            <div className="map-legend-item">
              <span className="map-legend-dot" style={{ background: "#3b82f6" }}></span>
              Flood
            </div>
            <div className="map-legend-item">
              <span className="map-legend-dot" style={{ background: "#ef4444" }}></span>
              Fire
            </div>
            <div className="map-legend-item">
              <span className="map-legend-dot" style={{ background: "#8b5cf6" }}></span>
              Earthquake
            </div>
            <div className="map-legend-item">
              <span className="map-legend-dot" style={{ background: "#06b6d4" }}></span>
              Cyclone
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="map-main">
        <div ref={mapRef} className="map-canvas"></div>

        {/* Map Controls */}
        <div className="map-controls">
          <button className="map-control-btn" onClick={handleZoomIn} title="Zoom In">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button className="map-control-btn" onClick={handleZoomOut} title="Zoom Out">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button className="map-control-btn" onClick={handleReset} title="Reset View">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </button>
        </div>

        {/* Selected Disaster Info */}
        {selectedDisaster && (
          <div className="map-info-card">
            <button className="map-info-close" onClick={() => setSelectedDisaster(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="map-info-header">
              <div
                className="map-info-indicator"
                style={{ background: getSeverityColor(selectedDisaster.severity) }}
              ></div>
              <div>
                <h3>{selectedDisaster.type}</h3>
                <p>{selectedDisaster.location}</p>
              </div>
            </div>
            <div className="map-info-details">
              <div className="map-info-row">
                <span>Severity</span>
                <span className={`alert-badge ${selectedDisaster.severity}`}>
                  {selectedDisaster.severity}
                </span>
              </div>
              {selectedDisaster.affectedPeople && (
                <div className="map-info-row">
                  <span>Affected</span>
                  <span>{selectedDisaster.affectedPeople} people</span>
                </div>
              )}
              <div className="map-info-row">
                <span>Status</span>
                <span>{getStatusLabel(selectedDisaster.status)}</span>
              </div>
              {selectedDisaster.timestamp && (
                <div className="map-info-row">
                  <span>Reported</span>
                  <span>{formatTime(selectedDisaster.timestamp)}</span>
                </div>
              )}
              {selectedDisaster.description && (
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-50)", display: "block", marginBottom: "4px" }}>Description</span>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-70)" }}>{selectedDisaster.description}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Click-to-Report Popup */}
        {clickedLocation && !selectedDisaster && (
          <div className="map-info-card" style={{ maxWidth: "280px" }}>
            <button className="map-info-close" onClick={() => setClickedLocation(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-50)", marginBottom: "4px" }}>📍 Selected Location</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-100)" }}>
                {clickedLocation.lat}, {clickedLocation.lng}
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleReportFromMap}
              style={{ width: "100%", padding: "10px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "8px" }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Report Disaster Here
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


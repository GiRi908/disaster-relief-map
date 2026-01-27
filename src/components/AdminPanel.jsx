import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy, onSnapshot } from "firebase/firestore";

// SVG Icons
const Icons = {
  refresh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23,4 23,10 17,10" />
      <polyline points="1,20 1,14 7,14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  trash: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  edit: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  save: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17,21 17,13 7,13 7,21" />
      <polyline points="7,3 7,8 15,8" />
    </svg>
  ),
  cancel: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  reports: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  empty: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  mapPin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
};

export default function AdminPanel() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        }));
        setReports(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "reports", id));
      // No need to manually update state - onSnapshot will handle it
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Failed to delete report.");
    }
  };

  const handleEdit = (report) => {
    setEditingId(report.id);
    setEditData({
      type: report.type || "",
      location: report.location || "",
      severity: report.severity || "info",
      status: report.status || "pending",
      description: report.description || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "reports", id), {
        type: editData.type,
        location: editData.location,
        severity: editData.severity,
        status: editData.status,
        description: editData.description,
      });
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error("Error updating report:", error);
      alert("Failed to update report.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "reports", id), { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return { bg: "rgba(251, 191, 36, 0.15)", color: "#f59e0b" };
      case "verified": return { bg: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" };
      case "resolved": return { bg: "rgba(16, 185, 129, 0.15)", color: "#10b981" };
      default: return { bg: "rgba(107, 114, 128, 0.15)", color: "#6b7280" };
    }
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
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-subtitle">Manage disaster reports and data</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            {Icons.reports}
            All Reports ({reports.length})
          </h2>
        </div>

        {reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{Icons.empty}</div>
            <div className="empty-state-title">No reports yet</div>
            <p>Submitted reports will appear here.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id}>
                    {editingId === report.id ? (
                      // Edit mode
                      <>
                        <td>
                          <select
                            value={editData.type}
                            onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                            className="form-select"
                            style={{ padding: "6px 8px", fontSize: "0.8125rem" }}
                          >
                            <option value="Flood">Flood</option>
                            <option value="Earthquake">Earthquake</option>
                            <option value="Cyclone">Cyclone</option>
                            <option value="Fire">Fire</option>
                            <option value="Landslide">Landslide</option>
                            <option value="Drought">Drought</option>
                            <option value="Tsunami">Tsunami</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editData.location}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                            className="form-input"
                            style={{ padding: "6px 8px", fontSize: "0.8125rem" }}
                          />
                        </td>
                        <td>
                          <select
                            value={editData.severity}
                            onChange={(e) => setEditData({ ...editData, severity: e.target.value })}
                            className="form-select"
                            style={{ padding: "6px 8px", fontSize: "0.8125rem" }}
                          >
                            <option value="info">Low</option>
                            <option value="warning">Medium</option>
                            <option value="critical">Critical</option>
                          </select>
                        </td>
                        <td>
                          <select
                            value={editData.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                            className="form-select"
                            style={{ padding: "6px 8px", fontSize: "0.8125rem" }}
                          >
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                        <td>
                          <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            className="form-textarea"
                            style={{ padding: "6px 8px", fontSize: "0.8125rem", minHeight: "60px" }}
                          />
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {formatDate(report.timestamp)}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleSaveEdit(report.id)}
                              style={{ padding: "6px 10px", fontSize: "0.8125rem" }}
                            >
                              {Icons.save}
                              Save
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={handleCancelEdit}
                              style={{ padding: "6px 10px", fontSize: "0.8125rem" }}
                            >
                              {Icons.cancel}
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // View mode
                      <>
                        <td>
                          <strong style={{ color: "var(--text-100)" }}>{report.type}</strong>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            {report.location}
                            {report.lat && report.lng && (
                              <span title={`${report.lat}, ${report.lng}`} style={{ color: "var(--color-primary)" }}>
                                {Icons.mapPin}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`alert-badge ${report.severity || "info"}`}>
                            {report.severity || "info"}
                          </span>
                        </td>
                        <td>
                          <select
                            value={report.status || "pending"}
                            onChange={(e) => handleStatusChange(report.id, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              borderRadius: "6px",
                              border: "none",
                              cursor: "pointer",
                              ...getStatusColor(report.status),
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                        <td style={{ maxWidth: "250px" }}>
                          {report.description?.substring(0, 80)}
                          {report.description?.length > 80 ? "..." : ""}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {formatDate(report.timestamp)}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleEdit(report)}
                              style={{ padding: "6px 10px", fontSize: "0.8125rem" }}
                            >
                              {Icons.edit}
                              Edit
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(report.id)}
                              style={{ padding: "6px 10px", fontSize: "0.8125rem" }}
                            >
                              {Icons.trash}
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

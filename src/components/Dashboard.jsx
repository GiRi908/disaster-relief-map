import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit, onSnapshot } from "firebase/firestore";

// SVG Icon Components
const Icons = {
    reports: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
        </svg>
    ),
    alert: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    check: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
        </svg>
    ),
    critical: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
    map: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2 1,6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
    ),
    edit: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    ),
    bell: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    ),
    settings: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
    info: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    ),
};

export default function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        resolved: 0,
        critical: 0,
    });
    const [recentAlerts, setRecentAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Real-time listener for reports
        const q = query(collection(db, "reports"), orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const reports = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate() || new Date(),
                }));

                // Calculate stats
                const total = reports.length;
                const critical = reports.filter(r => r.severity === "critical").length;
                const resolved = reports.filter(r => r.status === "resolved").length;
                const active = reports.filter(r => r.status !== "resolved").length;

                setStats({
                    total,
                    active,
                    resolved,
                    critical,
                });

                // Get recent 3 alerts
                setRecentAlerts(reports.slice(0, 3));
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching reports:", error);
                // Set demo stats if Firebase fails
                setStats({ total: 0, active: 0, resolved: 0, critical: 0 });
                setRecentAlerts([]);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const quickActions = [
        { to: "/map", icon: "map", title: "Live Map", desc: "View real-time disaster locations" },
        { to: "/report", icon: "edit", title: "New Report", desc: "Submit incident report" },
        { to: "/alerts", icon: "bell", title: "All Alerts", desc: "View active notifications" },
        { to: "/admin", icon: "settings", title: "Admin Panel", desc: "Manage reports & data" },
    ];

    const getIcon = (name) => {
        const icon = Icons[name];
        return icon || null;
    };

    const getSeverityIcon = (severity) => {
        if (severity === "critical") return Icons.critical;
        if (severity === "warning") return Icons.alert;
        return Icons.info;
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "Unknown";
        const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        return "Just now";
    };

    const statsDisplay = [
        { label: "Total Reports", value: stats.total.toLocaleString(), icon: "reports", color: "blue" },
        { label: "Active Alerts", value: stats.active.toString(), icon: "alert", color: "yellow" },
        { label: "Resolved", value: stats.resolved.toString(), icon: "check", color: "green" },
        { label: "Critical", value: stats.critical.toString(), icon: "critical", color: "red" },
    ];

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
                <h1 className="page-title">Command Center</h1>
                <p className="page-subtitle">Real-time overview of disaster relief operations across all regions</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {statsDisplay.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className={`stat-icon ${stat.color}`}>
                            {getIcon(stat.icon)}
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "16px", color: "var(--text-70)" }}>Quick Actions</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.to}
                            className="card"
                            style={{
                                textDecoration: "none",
                                padding: "24px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: "12px"
                            }}
                        >
                            <div style={{
                                width: "52px",
                                height: "52px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "var(--bg-elevated)",
                                borderRadius: "12px",
                                color: "var(--color-primary)"
                            }}>
                                {getIcon(action.icon)}
                            </div>
                            <div>
                                <div style={{ fontWeight: "600", color: "var(--text-100)", marginBottom: "4px" }}>
                                    {action.title}
                                </div>
                                <div style={{ fontSize: "0.8125rem", color: "var(--text-50)" }}>
                                    {action.desc}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Alerts */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">
                        <span className="pulse-dot"></span>
                        Recent Alerts
                    </h2>
                    <Link to="/alerts" className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.8125rem" }}>
                        View All
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "6px" }}>
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
                {recentAlerts.length === 0 ? (
                    <div className="empty-state" style={{ padding: "48px 24px" }}>
                        <div className="empty-state-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </div>
                        <div className="empty-state-title">No alerts yet</div>
                        <p>Submit your first report to see it here.</p>
                        <Link to="/report" className="btn btn-primary" style={{ marginTop: "16px" }}>
                            Create Report
                        </Link>
                    </div>
                ) : (
                    <div className="alerts-list">
                        {recentAlerts.map((alert, index) => (
                            <div key={alert.id || index} className="alert-card">
                                <div className={`alert-icon ${alert.severity || "info"}`}>
                                    {getSeverityIcon(alert.severity)}
                                </div>
                                <div className="alert-content">
                                    <div className="alert-title">{alert.type}</div>
                                    <div className="alert-description">{alert.description?.substring(0, 100) || `Incident at ${alert.location}`}{alert.description?.length > 100 ? "..." : ""}</div>
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
        </div>
    );
}

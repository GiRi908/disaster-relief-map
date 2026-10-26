import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Clean SaaS Line Icons matching the reference
const Icons = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  map: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  alert: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  report: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  admin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  help: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  collapse: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <polyline points="13 8 9 12 13 16" />
    </svg>
  ),
  expand: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <polyline points="11 8 15 12 11 16" />
    </svg>
  ),
  brandLogo: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
      <path d="M12 7v6" stroke="var(--accent-green)" strokeWidth="2.2" />
      <path d="M9 10h6" stroke="var(--accent-green)" strokeWidth="2.2" />
    </svg>
  ),
};

export default function Sidebar({ collapsed, mobileOpen, onClose, onToggleCollapse }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { to: "/dashboard", label: "Home", icon: "home" },
    { to: "/map", label: "Live Map", icon: "map" },
    { to: "/alerts", label: "Alerts", icon: "alert" },
    { to: "/report", label: "Report Incident", icon: "report" },
    { to: "/admin", label: "Admin Console", icon: "admin" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className={`saas-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "open" : ""}`}>
      {/* Brand Header */}
      <div className="saas-sidebar-header">
        {collapsed ? (
          <button
            className="saas-collapse-btn saas-collapse-btn-collapsed"
            onClick={onToggleCollapse}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            type="button"
          >
            <span className="saas-collapsed-icon saas-collapsed-brand">
              {Icons.brandLogo}
            </span>
            <span className="saas-collapsed-icon saas-collapsed-expand">
              {Icons.expand}
            </span>
          </button>
        ) : (
          <>
            <div
              className="saas-sidebar-brand"
              onClick={() => navigate("/dashboard")}
              title="Disaster Relief Map"
              style={{ cursor: "pointer" }}
            >
              <div className="saas-brand-icon">
                {Icons.brandLogo}
              </div>
              <span className="saas-brand-name">Relief Map</span>
            </div>
            <button
              className="saas-collapse-btn"
              onClick={onToggleCollapse}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              type="button"
            >
              {Icons.collapse}
            </button>
          </>
        )}
      </div>

      {/* Primary Navigation */}
      <nav className="saas-sidebar-nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `saas-nav-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <span className="saas-nav-icon">{Icons[link.icon]}</span>
            {!collapsed && <span className="saas-nav-text">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Pinned Bottom Items */}
      <div className="saas-sidebar-footer">
        <button className="saas-nav-link saas-footer-link" type="button" onClick={() => navigate("/alerts")}>
          <span className="saas-nav-icon">{Icons.help}</span>
          {!collapsed && <span className="saas-nav-text">Help & Support</span>}
        </button>

        <button className="saas-nav-link saas-footer-link" type="button" onClick={() => navigate("/admin")}>
          <span className="saas-nav-icon">{Icons.settings}</span>
          {!collapsed && <span className="saas-nav-text">Settings</span>}
        </button>

        {/* User Account / Logout */}
        <div className="saas-user-box">
          <div className="saas-user-avatar">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt={currentUser.displayName || "User"} />
            ) : (
              <span>{(currentUser?.displayName || currentUser?.email || "U").charAt(0).toUpperCase()}</span>
            )}
          </div>
          {!collapsed && (
            <div className="saas-user-meta">
              <div className="saas-user-name">
                {currentUser?.displayName || currentUser?.email?.split("@")[0] || "Operator"}
              </div>
              <div className="saas-user-role">
                {currentUser ? "Verified" : "Guest Mode"}
              </div>
            </div>
          )}
          {!collapsed && currentUser && (
            <button
              className="saas-logout-btn"
              onClick={handleLogout}
              title="Sign Out"
              type="button"
            >
              {Icons.logout}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

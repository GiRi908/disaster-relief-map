import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// SVG Icons
const Icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
  map: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2 1,6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  alert: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  report: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  admin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

export default function Sidebar({ collapsed, mobileOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/map", label: "Map View", icon: "map" },
    { to: "/alerts", label: "Alerts", icon: "alert" },
    { to: "/report", label: "Report", icon: "report" },
    { to: "/admin", label: "Admin", icon: "admin" },
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
    <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          {!collapsed && <span className="sidebar-logo-text">Relief Map</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <span className="sidebar-link-icon">{Icons[link.icon]}</span>
            {!collapsed && <span className="sidebar-link-text">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          {currentUser ? (
            <>
              <div className="sidebar-user-avatar">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName || "User"} />
                ) : (
                  <span>{(currentUser.displayName || currentUser.email || "U").charAt(0).toUpperCase()}</span>
                )}
              </div>
              {!collapsed && (
                <div className="sidebar-user-info">
                  <div className="sidebar-user-name">
                    {currentUser.displayName || currentUser.email?.split("@")[0] || "User"}
                  </div>
                  <div className="sidebar-user-email">
                    {currentUser.email}
                  </div>
                </div>
              )}
              {!collapsed && (
                <button
                  className="sidebar-logout-btn"
                  onClick={handleLogout}
                  title="Logout"
                >
                  {Icons.logout}
                </button>
              )}
            </>
          ) : (
            <>
              <div className="sidebar-user-avatar guest">
                <span>G</span>
              </div>
              {!collapsed && (
                <div className="sidebar-user-info">
                  <div className="sidebar-user-name">Guest User</div>
                  <div className="sidebar-user-email">Not signed in</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

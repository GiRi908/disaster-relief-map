import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function Header({ toggleSidebar }) {
  const [alerts] = useState(3);
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [selectedZone, setSelectedZone] = useState("All Disaster Zones");
  const location = useLocation();

  // Get dynamic title based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/map":
        return "Live Incident Map";
      case "/alerts":
        return "Active Alerts";
      case "/report":
        return "Report Incident";
      case "/admin":
        return "Admin Console";
      default:
        return "Emergency Operations";
    }
  };

  return (
    <header className="saas-header">
      <div className="saas-header-left">
        {/* Mobile toggle button */}
        <button
          className="saas-header-mobile-toggle"
          onClick={toggleSidebar}
          title="Toggle Menu"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <h1 className="saas-page-title">{getPageTitle()}</h1>
      </div>

      <div className="saas-header-right">
        {/* Date Range Pill Dropdown */}
        <div className="saas-pill-select">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="saas-select-input"
          >
            <option value="Live - Last 24h">Live - Last 24h</option>
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last 30 days">Last 30 days</option>
            <option value="All Time">All Time</option>
          </select>
          <svg className="saas-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Disaster Zone / Filter Pill Dropdown */}
        <div className="saas-pill-select">
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="saas-select-input"
          >
            <option value="All Disaster Zones">All Disaster Zones</option>
            <option value="Southern Zone (Chennai)">Southern Zone (Chennai)</option>
            <option value="Western Zone (Mumbai)">Western Zone (Mumbai)</option>
            <option value="Northern Zone (Delhi)">Northern Zone (Delhi)</option>
            <option value="Eastern Zone (Kolkata)">Eastern Zone (Kolkata)</option>
          </select>
          <svg className="saas-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Notification Bell */}
        <button className="saas-icon-btn" title="Notifications" type="button">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {alerts > 0 && <span className="saas-badge-dot" />}
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}

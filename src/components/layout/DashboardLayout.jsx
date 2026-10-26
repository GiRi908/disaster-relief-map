import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "../Header";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  const toggleSidebar = () => {
    // On mobile (< 1024px), toggle the open state
    if (window.innerWidth <= 1024) {
      setSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-viewport">
      <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Mobile overlay */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
          onClick={closeMobileSidebar}
        />

        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={sidebarOpen}
          onClose={closeMobileSidebar}
          onToggleCollapse={toggleSidebar}
        />
        <div className={`main-content ${sidebarCollapsed ? "collapsed-sidebar" : ""}`}>
          <Header toggleSidebar={toggleSidebar} />
          <main className="page-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

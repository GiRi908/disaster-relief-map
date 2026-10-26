import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const Icons = {
  upArrow: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  ),
  downArrow: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  ),
  location: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  clock: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  arrowRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  map: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  report: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

function formatTime(timestamp) {
  if (!timestamp) return "Unknown";
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const diff = Date.now() - date;
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0, critical: 0 });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const reports = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          timestamp: d.data().timestamp?.toDate() || new Date(),
        }));
        setStats({
          total: reports.length,
          critical: reports.filter((r) => r.severity === "critical").length,
          resolved: reports.filter((r) => r.status === "resolved").length,
          active: reports.filter((r) => r.status !== "resolved").length,
        });
        setRecentAlerts(reports.slice(0, 5));
        setLoading(false);
      },
      () => {
        setStats({ total: 0, active: 0, resolved: 0, critical: 0 });
        setRecentAlerts([]);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="saas-loading-wrap">
        <div className="saas-loading-spinner" />
      </div>
    );
  }

  // 5 KPI Cards aligned directly with the Disaster Relief Map operations
  const kpiCards = [
    {
      title: "Total Incidents",
      trend: "+12%",
      isPositive: true,
      value: stats.total > 0 ? stats.total.toLocaleString() : "247",
      subtext: "Up 12% this week",
    },
    {
      title: "Active Alerts",
      trend: "+11%",
      isPositive: true,
      value: stats.active > 0 ? stats.active.toLocaleString() : "48",
      subtext: "Requires active response",
    },
    {
      title: "Critical Priority",
      trend: "-29%",
      isPositive: false,
      value: stats.critical > 0 ? stats.critical.toLocaleString() : "14",
      subtext: "Down 29% this week",
    },
    {
      title: "Resolved Cases",
      trend: "+38%",
      isPositive: true,
      value: stats.resolved > 0 ? stats.resolved.toLocaleString() : "185",
      subtext: "Up 38% this week",
    },
    {
      title: "Resolution Rate",
      trend: "+11%",
      isPositive: true,
      value: `${stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 94}%`,
      subtext: "Avg. response: 42 mins",
    },
  ];

  // Funnel bar chart definition: 32 bars with 4 highlighted relief pipeline stages
  // Stages: Reported (100%), Verified (53%), Dispatched (13%), Resolved (10%)
  const funnelBars = [
    { height: 100, isHighlight: true, stage: "Reported", count: "1,500", pct: "100%" },
    { height: 95, isHighlight: false },
    { height: 90, isHighlight: false },
    { height: 86, isHighlight: false },
    { height: 80, isHighlight: false },
    { height: 75, isHighlight: false },
    { height: 70, isHighlight: false },
    { height: 65, isHighlight: false },
    { height: 60, isHighlight: false },
    { height: 56, isHighlight: false },
    { height: 53, isHighlight: true, stage: "Verified", count: "800", pct: "53%" },
    { height: 48, isHighlight: false },
    { height: 44, isHighlight: false },
    { height: 39, isHighlight: false },
    { height: 34, isHighlight: false },
    { height: 30, isHighlight: false },
    { height: 26, isHighlight: false },
    { height: 21, isHighlight: false },
    { height: 17, isHighlight: false },
    { height: 13, isHighlight: true, stage: "Dispatched", count: "200", pct: "13%" },
    { height: 12, isHighlight: false },
    { height: 12, isHighlight: false },
    { height: 11, isHighlight: false },
    { height: 11, isHighlight: false },
    { height: 10, isHighlight: false },
    { height: 10, isHighlight: false },
    { height: 10, isHighlight: true, stage: "Resolved", count: "150", pct: "10%" },
    { height: 9, isHighlight: false },
    { height: 9, isHighlight: false },
    { height: 8, isHighlight: false },
    { height: 8, isHighlight: false },
  ];

  const quickActions = [
    { to: "/map", icon: "map", title: "Live Map", desc: "View real-time disaster locations" },
    { to: "/report", icon: "report", title: "New Report", desc: "Submit incident or hazard report" },
    { to: "/alerts", icon: "bell", title: "All Alerts", desc: "Browse active emergency notifications" },
    { to: "/admin", icon: "settings", title: "Admin Console", desc: "Manage verified incident records" },
  ];

  return (
    <div className="saas-dashboard-grid">
      {/* =========================================================
          ROW 1: 5 KPI Cards (Aligned with Disaster Relief Map)
          ========================================================= */}
      <div className="saas-kpi-row">
        {kpiCards.map((kpi, idx) => (
          <div key={idx} className="saas-card saas-kpi-card">
            <div className="saas-kpi-header">
              <span className="saas-kpi-label">{kpi.title}</span>
              <span className={`saas-trend-badge ${kpi.isPositive ? "positive" : "negative"}`}>
                {kpi.trend}
              </span>
            </div>

            <div className="saas-kpi-value-row">
              <span className="saas-kpi-value">{kpi.value}</span>
              <span className={`saas-kpi-arrow-pill ${kpi.isPositive ? "up" : "down"}`}>
                {kpi.isPositive ? Icons.upArrow : Icons.downArrow}
              </span>
            </div>

            <div className="saas-kpi-subtext">{kpi.subtext}</div>
          </div>
        ))}
      </div>

      {/* =========================================================
          ROW 2: Incident Activity Trend & Relief Pipeline Funnel
          ========================================================= */}
      <div className="saas-charts-row">
        {/* Left Card: Incident Activity & Relief */}
        <div className="saas-card saas-area-chart-card">
          <div className="saas-chart-header">
            <div className="saas-chart-title-block">
              <h2 className="saas-chart-title">Incident Activity & Relief</h2>
              <p className="saas-chart-subtitle">
                Total reports up 7%, while critical incidents decreased by 12%
              </p>
            </div>

            <div className="saas-chart-legend">
              <div className="saas-legend-item">
                <span className="saas-legend-dot green" />
                <span className="saas-legend-text">Total reports</span>
                <span className="saas-legend-num">4,782</span>
                <span className="saas-trend-badge positive">+7%</span>
              </div>
              <div className="saas-legend-item">
                <span className="saas-legend-dot grey" />
                <span className="saas-legend-text">Resolved</span>
                <span className="saas-legend-num">503</span>
                <span className="saas-trend-badge negative">-12%</span>
              </div>
            </div>
          </div>

          {/* SVG Smooth Area Chart */}
          <div className="saas-svg-chart-container">
            {/* Grid labels */}
            <div className="saas-y-axis">
              <span>10k</span>
              <span>5k</span>
              <span>1k</span>
              <span>500</span>
              <span>0</span>
            </div>

            <div className="saas-chart-drawing-area">
              {/* Dashed Horizontal Gridlines */}
              <div className="saas-gridline-dashed" style={{ top: "0%" }} />
              <div className="saas-gridline-dashed" style={{ top: "25%" }} />
              <div className="saas-gridline-dashed" style={{ top: "50%" }} />
              <div className="saas-gridline-dashed" style={{ top: "75%" }} />
              <div className="saas-gridline-dashed" style={{ top: "100%" }} />

              <svg
                viewBox="0 0 600 200"
                preserveAspectRatio="none"
                className="saas-lines-svg"
              >
                <defs>
                  {/* Soft green gradient fill */}
                  <linearGradient id="greenFillGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4CC47A" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#4CC47A" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Subtle grey fill for secondary line */}
                  <linearGradient id="greyFillGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D0D0CE" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#D0D0CE" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Secondary grey filled area & line (Resolved) */}
                <path
                  d="M 30,140 Q 90,165 150,145 T 270,140 T 390,135 T 510,130 T 570,120 L 570,200 L 30,200 Z"
                  fill="url(#greyFillGradient)"
                />
                <path
                  d="M 30,140 Q 90,165 150,145 T 270,140 T 390,135 T 510,130 T 570,120"
                  fill="none"
                  stroke="#D0D0CE"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Primary green smooth filled area & line (Total Incidents) */}
                <path
                  d="M 30,130 C 70,145 100,125 150,130 C 200,100 230,120 270,115 C 320,135 340,85 390,80 C 440,110 470,80 520,78 C 550,85 570,90 570,90 L 570,200 L 30,200 Z"
                  fill="url(#greenFillGradient)"
                />
                <path
                  d="M 30,130 C 70,145 100,125 150,130 C 200,100 230,120 270,115 C 320,135 340,85 390,80 C 440,110 470,80 520,78 C 550,85 570,90 570,90"
                  fill="none"
                  stroke="#4CC47A"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />

                {/* Marker circle on Friday peak */}
                <circle cx="390" cy="80" r="5" fill="#4CC47A" stroke="#FFFFFF" strokeWidth="2.5" />
              </svg>

              {/* Floating Tooltip pinned to Friday peak */}
              <div className="saas-chart-tooltip" style={{ left: "62%", top: "24%" }}>
                <div className="saas-tooltip-date">14 March 2:39 PM</div>
                <div className="saas-tooltip-stat">
                  <span className="saas-tooltip-dot" />
                  <strong>4,782</strong> incidents
                </div>
              </div>
            </div>
          </div>

          {/* X Axis */}
          <div className="saas-x-axis">
            <span className="saas-x-item">Mon</span>
            <span className="saas-x-item">Tue</span>
            <span className="saas-x-item">Wed</span>
            <span className="saas-x-item">Thu</span>
            <span className="saas-x-item active-pill">Fri</span>
            <span className="saas-x-item">Sat</span>
            <span className="saas-x-item">Sun</span>
          </div>
        </div>

        {/* Right Card: Relief Pipeline (Funnel Bar Chart with Thin Rounded Bars) */}
        <div className="saas-card saas-funnel-card">
          <div className="saas-chart-header">
            <div className="saas-chart-title-block">
              <h2 className="saas-chart-title">Relief Pipeline</h2>
              <p className="saas-chart-subtitle">
                Response workflow from report to resolution
              </p>
            </div>

            <div className="saas-funnel-rate-block">
              <span className="saas-funnel-rate-label">Resolution rate</span>
              <div className="saas-funnel-rate-val-row">
                <span className="saas-funnel-rate-val">94%</span>
                <span className="saas-trend-badge positive">+7%</span>
              </div>
            </div>
          </div>

          {/* Funnel bars visualization */}
          <div className="saas-funnel-bars-container">
            {funnelBars.map((bar, idx) => (
              <div key={idx} className="saas-funnel-bar-col">
                {bar.pct && (
                  <span className="saas-funnel-pct-tag">{bar.pct}</span>
                )}
                <div className="saas-funnel-bar-wrapper">
                  <div
                    className={`saas-funnel-bar ${bar.isHighlight ? "highlight" : "inactive"}`}
                    style={{ height: `${bar.height}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Funnel Stage Labels underneath */}
          <div className="saas-funnel-stages-row">
            <div className="saas-funnel-stage">
              <div className="saas-stage-title">Reported</div>
              <div className="saas-stage-val">1,500</div>
            </div>
            <div className="saas-funnel-stage">
              <div className="saas-stage-title">Verified</div>
              <div className="saas-stage-val">800</div>
            </div>
            <div className="saas-funnel-stage">
              <div className="saas-stage-title">Dispatched</div>
              <div className="saas-stage-val">200</div>
            </div>
            <div className="saas-funnel-stage">
              <div className="saas-stage-title">Resolved</div>
              <div className="saas-stage-val">150</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 3: Field Responders, Resource Distribution, Regional Alerts
          ========================================================= */}
      <div className="saas-triplet-row">
        {/* 1. Semicircle Gauge Card: Field Responders */}
        <div className="saas-card saas-gauge-card">
          <div className="saas-card-head-simple">
            <h3 className="saas-block-title">Field Responders</h3>
          </div>

          <div className="saas-gauge-wrap">
            <svg viewBox="0 0 200 120" className="saas-gauge-svg">
              {/* Background grey track arc */}
              <path
                d="M 25 105 A 75 75 0 0 1 175 105"
                fill="none"
                stroke="#E8E8E8"
                strokeWidth="11"
                strokeLinecap="round"
              />
              {/* Active green arc */}
              <path
                d="M 25 105 A 75 75 0 0 1 165 70"
                fill="none"
                stroke="#4CC47A"
                strokeWidth="11"
                strokeLinecap="round"
              />
            </svg>

            <div className="saas-gauge-center-content">
              <div className="saas-gauge-big-num">3,271</div>
              <div className="saas-gauge-sub">Active Responders</div>
            </div>
          </div>

          <div className="saas-gauge-footer">
            <span className="saas-gauge-ft-label">Total Registered Force</span>
            <span className="saas-gauge-ft-num">4,182</span>
          </div>
        </div>

        {/* 2. Relief Resource Allocation Card */}
        <div className="saas-card saas-traffic-card">
          <div className="saas-card-head-simple">
            <h3 className="saas-block-title">Resource Allocation</h3>
          </div>

          {/* Top 4 mini metrics */}
          <div className="saas-traffic-mini-stats">
            <div className="saas-tf-mini-item">
              <span className="saas-tf-mini-label">Medical Aid</span>
              <span className="saas-tf-mini-val">11,596 units</span>
            </div>
            <div className="saas-tf-mini-item">
              <span className="saas-tf-mini-label">Food & Water</span>
              <span className="saas-tf-mini-val">5,420 pkgs</span>
            </div>
            <div className="saas-tf-mini-item">
              <span className="saas-tf-mini-label">Shelter Kits</span>
              <span className="saas-tf-mini-val">7,574 kits</span>
            </div>
            <div className="saas-tf-mini-item">
              <span className="saas-tf-mini-label">Rescue Teams</span>
              <span className="saas-tf-mini-val">608 units</span>
            </div>
          </div>

          {/* Segmented multi-colored progress bar */}
          <div className="saas-segmented-bar">
            <div className="saas-seg" style={{ width: "38%", background: "#F59E0B" }} />
            <div className="saas-seg" style={{ width: "24%", background: "#10B981" }} />
            <div className="saas-seg" style={{ width: "16%", background: "#06B6D4" }} />
            <div className="saas-seg" style={{ width: "10%", background: "#3B82F6" }} />
            <div className="saas-seg" style={{ width: "7%", background: "#8B5CF6" }} />
            <div className="saas-seg" style={{ width: "5%", background: "#EC4899" }} />
          </div>

          {/* Two-column dot legend */}
          <div className="saas-traffic-legends-grid">
            <div className="saas-tf-col">
              <div className="saas-tf-row">
                <span className="saas-tf-dot" style={{ background: "#F59E0B" }} />
                <span className="saas-tf-name">Medical Aid</span>
                <span className="saas-tf-count">3,707</span>
              </div>
              <div className="saas-tf-row">
                <span className="saas-tf-dot" style={{ background: "#06B6D4" }} />
                <span className="saas-tf-name">Shelter Kits</span>
                <span className="saas-tf-count">979</span>
              </div>
              <div className="saas-tf-row">
                <span className="saas-tf-dot" style={{ background: "#8B5CF6" }} />
                <span className="saas-tf-name">Logistics</span>
                <span className="saas-tf-count">213</span>
              </div>
            </div>

            <div className="saas-tf-col">
              <div className="saas-tf-row">
                <span className="saas-tf-dot" style={{ background: "#10B981" }} />
                <span className="saas-tf-name">Food & Water</span>
                <span className="saas-tf-count">1,490</span>
              </div>
              <div className="saas-tf-row">
                <span className="saas-tf-dot" style={{ background: "#3B82F6" }} />
                <span className="saas-tf-name">Rescue Teams</span>
                <span className="saas-tf-count">728</span>
              </div>
              <div className="saas-tf-row">
                <span className="saas-tf-dot" style={{ background: "#EC4899" }} />
                <span className="saas-tf-name">Communications</span>
                <span className="saas-tf-count">38</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Incidents by Region Table Card */}
        <div className="saas-card saas-region-card">
          <div className="saas-card-head-simple">
            <h3 className="saas-block-title">Incidents by Region</h3>
          </div>

          <table className="saas-region-table">
            <thead>
              <tr>
                <th className="th-left">Region</th>
                <th className="th-right">Alerts</th>
                <th className="th-right">Affected Pop.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td-left">Chennai, Tamil Nadu</td>
                <td className="td-right">
                  <span className="saas-val-arrow-group">
                    129
                    <span className="saas-dot-icon red">{Icons.downArrow}</span>
                  </span>
                </td>
                <td className="td-right num-mono">15,000+</td>
              </tr>
              <tr>
                <td className="td-left">Mumbai, Maharashtra</td>
                <td className="td-right">
                  <span className="saas-val-arrow-group">
                    7
                    <span className="saas-dot-icon green">{Icons.upArrow}</span>
                  </span>
                </td>
                <td className="td-right num-mono">8,500+</td>
              </tr>
              <tr>
                <td className="td-left">Delhi NCR</td>
                <td className="td-right">
                  <span className="saas-val-arrow-group">
                    129
                    <span className="saas-dot-icon green">{Icons.upArrow}</span>
                  </span>
                </td>
                <td className="td-right num-mono">500+</td>
              </tr>
              <tr>
                <td className="td-left">Kolkata, West Bengal</td>
                <td className="td-right">
                  <span className="saas-val-arrow-group">
                    1
                    <span className="saas-dot-icon red">{Icons.downArrow}</span>
                  </span>
                </td>
                <td className="td-right num-mono">22,000+</td>
              </tr>
              <tr>
                <td className="td-left">Bangalore, Karnataka</td>
                <td className="td-right">
                  <span className="saas-val-arrow-group">
                    4
                    <span className="saas-dot-icon green">{Icons.upArrow}</span>
                  </span>
                </td>
                <td className="td-right num-mono">1,200+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          ROW 4: Quick Actions
          ========================================================= */}
      <div className="saas-quick-actions-row">
        {quickActions.map((qa, idx) => (
          <Link key={idx} to={qa.to} className="saas-card saas-qa-card">
            <div className="saas-qa-icon">
              {Icons[qa.icon]}
            </div>
            <div className="saas-qa-info">
              <div className="saas-qa-title">{qa.title}</div>
              <div className="saas-qa-desc">{qa.desc}</div>
            </div>
            <div className="saas-qa-arrow">
              {Icons.arrowRight}
            </div>
          </Link>
        ))}
      </div>

      {/* =========================================================
          ROW 5: Live Incidents Stream (Direct Firestore Data)
          ========================================================= */}
      <div className="saas-incidents-section">
        <div className="saas-card saas-incidents-card">
          <div className="saas-card-header-flex">
            <div>
              <h3 className="saas-block-title">Live Incident Stream</h3>
              <p className="saas-chart-subtitle">
                Real-time operational alerts from field responders
              </p>
            </div>
            <Link to="/alerts" className="saas-pill-btn">
              <span>View All Alerts</span>
              {Icons.arrowRight}
            </Link>
          </div>

          {recentAlerts.length === 0 ? (
            <div className="saas-empty-box">
              <p>No active incidents registered. All systems operational.</p>
              <Link to="/report" className="saas-primary-btn" style={{ marginTop: 12 }}>
                Create Incident Report
              </Link>
            </div>
          ) : (
            <div className="saas-incident-list">
              {recentAlerts.map((alert, idx) => (
                <div key={alert.id || idx} className="saas-incident-row">
                  <div className={`saas-severity-indicator ${alert.severity || "info"}`} />
                  <div className="saas-incident-details">
                    <div className="saas-incident-type-row">
                      <span className="saas-incident-type">{alert.type || "Incident"}</span>
                      <span className={`saas-trend-badge ${alert.severity === "critical" ? "negative" : "positive"}`}>
                        {alert.severity || "info"}
                      </span>
                    </div>
                    <div className="saas-incident-desc">
                      {alert.description || `Field notification logged at ${alert.location || "assigned sector"}`}
                    </div>
                    <div className="saas-incident-meta">
                      <span className="saas-meta-tag">
                        {Icons.location}
                        {alert.location || "Coordinate Zone"}
                      </span>
                      <span className="saas-meta-tag">
                        {Icons.clock}
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

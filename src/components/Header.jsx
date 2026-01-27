import ThemeToggle from "./ThemeToggle";

export default function Header({ toggleSidebar }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="header-toggle" onClick={toggleSidebar}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="header-title">Disaster Relief Dashboard</h1>
      </div>
      <div className="header-right">
        <ThemeToggle />
      </div>
    </header>
  );
}

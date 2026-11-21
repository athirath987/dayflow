import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Target,
  Timer,
  BookOpen,
  TrendingUp,
  X,
  Settings,
  DownloadCloud
} from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import { useSettings } from "../../hooks/useSettings";
import { usePwaInstall } from "../../hooks/usePwaInstall";

const navItems = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Tasks", icon: CheckSquare },
  { name: "Calendar", icon: CalendarDays },
  { name: "Habits", icon: Target },
  { name: "Focus", icon: Timer },
  { name: "Notes", icon: BookOpen },
  { name: "Progress", icon: TrendingUp }
];

export default function Sidebar({ activePage, setActivePage, mobileOpen, setMobileOpen }) {
  const { pendingTasks } = useTasks();
  const { profile, setSettingsModalOpen } = useSettings();
  const { canInstall, promptInstall } = usePwaInstall();

  return (
    <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="brand">
        <div className="brand-logo">D</div>
        <span>
          dayflow<span className="brand-dot">.</span>
        </span>
        <button
          className="mobile-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        >
          <X size={19} />
        </button>
      </div>

      <p className="nav-label">WORKSPACE</p>

      <nav>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.name;
          return (
            <button
              key={item.name}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => {
                setActivePage(item.name);
                setMobileOpen(false);
              }}
            >
              <Icon size={18} />
              <span>{item.name}</span>
              {item.name === "Tasks" && pendingTasks.length > 0 && (
                <span className="nav-count">{pendingTasks.length}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        {canInstall && (
          <button
            type="button"
            className="secondary-button"
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "8px 12px",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "rgba(139, 114, 248, 0.12)",
              color: "var(--accent)",
              border: "1px solid rgba(139, 114, 248, 0.3)"
            }}
            onClick={promptInstall}
          >
            <DownloadCloud size={16} /> Install App
          </button>
        )}

        <div
          className="profile"
          onClick={() => setSettingsModalOpen(true)}
          style={{ cursor: "pointer" }}
          title="Open settings"
        >
          <div className="avatar">{profile.avatar || "A"}</div>
          <div>
            <strong>{profile.name || "My Workspace"}</strong>
            <span>{profile.subtitle || "Personal account"}</span>
          </div>
          <button
            type="button"
            className="icon-button"
            style={{ width: "32px", height: "32px", border: "none", background: "transparent" }}
            onClick={(e) => {
              e.stopPropagation();
              setSettingsModalOpen(true);
            }}
            aria-label="Open settings"
          >
            <Settings size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}

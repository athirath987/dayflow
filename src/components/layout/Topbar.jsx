import { Menu, Bell, Cloud, CloudOff, RefreshCw } from "lucide-react";
import { formatShortDate } from "../../utils/dateUtils";
import { useSettings } from "../../hooks/useSettings";

export default function Topbar({ activePage, setMobileOpen }) {
  const todayLabel = formatShortDate(new Date());
  const { profile, syncStatus, setSettingsModalOpen } = useSettings();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <span className="breadcrumb">Workspace /</span>
        <strong>{activePage}</strong>
      </div>

      <div className="topbar-right">
        <button
          className="icon-button"
          onClick={() => setSettingsModalOpen(true)}
          title={`Cloud Sync: ${syncStatus === "synced" ? "Synced" : syncStatus === "syncing" ? "Syncing..." : "Local-only"}`}
          style={{ position: "relative" }}
          aria-label="Cloud sync status"
        >
          {syncStatus === "synced" ? (
            <Cloud size={18} color="var(--green)" />
          ) : syncStatus === "syncing" ? (
            <RefreshCw size={18} color="var(--accent)" />
          ) : (
            <CloudOff size={18} color="var(--text-muted)" />
          )}
        </button>

        <span className="today-label">{todayLabel}</span>
        <button className="icon-button" title="Notifications" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div
          className="avatar small-avatar"
          onClick={() => setSettingsModalOpen(true)}
          style={{ cursor: "pointer" }}
          title="Account settings"
        >
          {profile.avatar || "A"}
        </div>
      </div>
    </header>
  );
}

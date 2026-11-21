import { useState } from "react";
import { Cloud, User, Download, Upload, RefreshCw, CheckCircle, AlertCircle, Database } from "lucide-react";
import Modal from "../common/Modal";
import { useSettings } from "../../hooks/useSettings";

export default function SettingsModal() {
  const {
    profile,
    updateProfile,
    supabaseConfig,
    updateSupabaseConfig,
    syncStatus,
    lastSyncedAt,
    runSync,
    exportData,
    importData,
    settingsModalOpen,
    setSettingsModalOpen
  } = useSettings();

  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    name: profile.name,
    subtitle: profile.subtitle,
    avatar: profile.avatar
  });
  const [supabaseForm, setSupabaseForm] = useState({
    url: supabaseConfig.url,
    anonKey: supabaseConfig.anonKey
  });
  const [importStatus, setImportStatus] = useState("");

  if (!settingsModalOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    setSettingsModalOpen(false);
  };

  const handleSaveSupabase = (e) => {
    e.preventDefault();
    updateSupabaseConfig(supabaseForm.url, supabaseForm.anonKey);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result;
      if (typeof content === "string") {
        const success = await importData(content);
        setImportStatus(success ? "Import successful! Reloading..." : "Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal
      isOpen={settingsModalOpen}
      onClose={() => setSettingsModalOpen(false)}
      eyebrow="PREFERENCES"
      title="Workspace Settings"
    >
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", marginBottom: "20px", paddingBottom: "10px" }}>
        <button
          className={`filter-chip ${activeTab === "profile" ? "selected" : ""}`}
          onClick={() => setActiveTab("profile")}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <User size={14} /> Profile
        </button>
        <button
          className={`filter-chip ${activeTab === "cloud" ? "selected" : ""}`}
          onClick={() => setActiveTab("cloud")}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Cloud size={14} /> Cloud Sync
        </button>
        <button
          className={`filter-chip ${activeTab === "backup" ? "selected" : ""}`}
          onClick={() => setActiveTab("backup")}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Database size={14} /> Data & Backups
        </button>
      </div>

      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile}>
          <label>Workspace Name</label>
          <input
            required
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
          />

          <label>Account Label / Subtitle</label>
          <input
            value={profileForm.subtitle}
            onChange={(e) => setProfileForm({ ...profileForm, subtitle: e.target.value })}
          />

          <label>Avatar Letter / Icon</label>
          <input
            maxLength={2}
            value={profileForm.avatar}
            onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value.toUpperCase() })}
            style={{ width: "80px", textAlign: "center" }}
          />

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={() => setSettingsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Save Profile
            </button>
          </div>
        </form>
      )}

      {activeTab === "cloud" && (
        <form onSubmit={handleSaveSupabase}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--surface)", borderRadius: "8px", marginBottom: "16px" }}>
            <div>
              <strong style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                {syncStatus === "synced" && <CheckCircle size={16} color="var(--green)" />}
                {syncStatus === "error" && <AlertCircle size={16} color="var(--red)" />}
                {syncStatus === "local_only" && <Database size={16} color="var(--text-muted)" />}
                {syncStatus === "syncing" && <RefreshCw size={16} className="spin" color="var(--accent)" />}
                Status: {syncStatus === "synced" ? "Connected & Synced" : syncStatus === "syncing" ? "Syncing..." : syncStatus === "error" ? "Sync Issue" : "Local Storage Only"}
              </strong>
              {lastSyncedAt && <small style={{ color: "var(--text-muted)", display: "block", marginTop: "2px" }}>Last sync: {lastSyncedAt}</small>}
            </div>
            {supabaseConfig.url && (
              <button
                type="button"
                className="secondary-button"
                style={{ padding: "6px 12px", fontSize: "13px" }}
                onClick={runSync}
                disabled={syncStatus === "syncing"}
              >
                <RefreshCw size={13} /> Sync Now
              </button>
            )}
          </div>

          <label>Supabase Project URL</label>
          <input
            placeholder="https://xyzcompany.supabase.co"
            value={supabaseForm.url}
            onChange={(e) => setSupabaseForm({ ...supabaseForm, url: e.target.value })}
          />

          <label>Supabase Public Anon Key</label>
          <input
            type="password"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={supabaseForm.anonKey}
            onChange={(e) => setSupabaseForm({ ...supabaseForm, anonKey: e.target.value })}
          />

          <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5", margin: "12px 0" }}>
            Leave blank to operate 100% offline with local IndexedDB storage. Connect Supabase to sync your workspace across your laptop and phone.
          </p>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={() => setSettingsModalOpen(false)}>
              Close
            </button>
            <button type="submit" className="primary-button">
              Save & Connect
            </button>
          </div>
        </form>
      )}

      {activeTab === "backup" && (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "15px" }}>Export Data</h4>
            <p style={{ margin: "0 0 12px 0", color: "var(--text-muted)", fontSize: "13px" }}>
              Download a complete offline JSON backup of all your tasks, habits, calendar events, and notes.
            </p>
            <button type="button" className="secondary-button" onClick={exportData} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Download size={16} /> Export Workspace (.json)
            </button>
          </div>

          <div style={{ paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "15px" }}>Restore from Backup</h4>
            <p style={{ margin: "0 0 12px 0", color: "var(--text-muted)", fontSize: "13px" }}>
              Restore your workspace from a previously exported DayFlow backup file.
            </p>
            <label className="secondary-button" style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <Upload size={16} /> Choose Backup File
              <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
            {importStatus && <p style={{ fontSize: "13px", marginTop: "10px", color: "var(--accent)" }}>{importStatus}</p>}
          </div>

          <div className="modal-actions" style={{ marginTop: "24px" }}>
            <button type="button" className="primary-button" onClick={() => setSettingsModalOpen(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

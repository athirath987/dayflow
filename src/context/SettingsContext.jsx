import { useState, useEffect, useCallback } from "react";
import { SettingsContext } from "./settingsContextDef";
import { readStorage, writeStorage, db } from "../services/db";
import { getSupabaseCredentials } from "../services/supabase";
import { syncWithSupabase } from "../services/syncEngine";

const defaultProfile = {
  name: "My Workspace",
  subtitle: "Personal account",
  avatar: "A"
};

export function SettingsProvider({ children }) {
  const [profile, setProfile] = useState(() =>
    readStorage("dayflow-profile", defaultProfile)
  );

  const [supabaseConfig, setSupabaseConfig] = useState(() => {
    const creds = getSupabaseCredentials();
    return {
      url: creds.url || "",
      anonKey: creds.anonKey || "",
      source: creds.source || "none"
    };
  });

  const [syncStatus, setSyncStatus] = useState(
    supabaseConfig.url ? "idle" : "local_only"
  );
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  useEffect(() => {
    writeStorage("dayflow-profile", profile);
  }, [profile]);

  const updateProfile = (newProfile) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  const updateSupabaseConfig = (url, anonKey) => {
    const config = { url: url.trim(), anonKey: anonKey.trim() };
    writeStorage("dayflow-supabase-config", config);
    setSupabaseConfig({ ...config, source: "user" });
    setSyncStatus(config.url && config.anonKey ? "idle" : "local_only");
  };

  const runSync = useCallback(async () => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      setSyncStatus("local_only");
      return;
    }

    setSyncStatus("syncing");
    const result = await syncWithSupabase();
    if (result.success) {
      setSyncStatus("synced");
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } else {
      setSyncStatus("error");
    }
  }, [supabaseConfig]);

  // Sync on startup asynchronously if credentials exist
  useEffect(() => {
    let ignore = false;
    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const timer = setTimeout(() => {
        if (!ignore) {
          runSync();
        }
      }, 500);
      return () => {
        ignore = true;
        clearTimeout(timer);
      };
    }
  }, [supabaseConfig.url, supabaseConfig.anonKey, runSync]);

  // Export full workspace to JSON
  const exportData = () => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks: readStorage("dayflow-tasks", []),
      habits: readStorage("dayflow-habits", []),
      events: readStorage("dayflow-events", []),
      notes: readStorage("dayflow-notes", []),
      profile: readStorage("dayflow-profile", defaultProfile)
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dayflow-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import full workspace from JSON
  const importData = async (jsonData) => {
    try {
      const data = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

      if (data.tasks) {
        writeStorage("dayflow-tasks", data.tasks);
        await db.tasks.clear().then(() => db.tasks.bulkAdd(data.tasks)).catch(() => {});
      }
      if (data.habits) {
        writeStorage("dayflow-habits", data.habits);
        await db.habits.clear().then(() => db.habits.bulkAdd(data.habits)).catch(() => {});
      }
      if (data.events) {
        writeStorage("dayflow-events", data.events);
        await db.events.clear().then(() => db.events.bulkAdd(data.events)).catch(() => {});
      }
      if (data.notes) {
        writeStorage("dayflow-notes", data.notes);
      }
      if (data.profile) {
        setProfile(data.profile);
      }

      window.location.reload();
      return true;
    } catch (err) {
      console.error("Failed to import data:", err);
      return false;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

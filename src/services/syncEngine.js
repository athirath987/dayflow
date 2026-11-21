import { getSupabaseClient } from "./supabase";
import { readStorage, writeStorage, db } from "./db";

export async function syncWithSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, reason: "not_configured" };
  }

  if (!navigator.onLine) {
    return { success: false, reason: "offline" };
  }

  try {
    const tasks = readStorage("dayflow-tasks", []);
    const habits = readStorage("dayflow-habits", []);
    const events = readStorage("dayflow-events", []);
    const notes = readStorage("dayflow-notes", []);

    // Push local backup snapshot to cloud
    const snapshot = {
      id: "workspace_default",
      tasks,
      habits,
      events,
      notes,
      synced_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("dayflow_sync")
      .upsert(snapshot, { onConflict: "id" });

    if (error) {
      console.warn("Supabase upsert note:", error.message);
      // Even if table doesn't exist yet, we report the message cleanly
      return { success: false, reason: error.message };
    }

    // Pull any newer cloud data
    const { data: cloudData, error: pullError } = await supabase
      .from("dayflow_sync")
      .select("*")
      .eq("id", "workspace_default")
      .single();

    if (!pullError && cloudData) {
      if (cloudData.tasks) {
        writeStorage("dayflow-tasks", cloudData.tasks);
        await db.tasks.clear().then(() => db.tasks.bulkAdd(cloudData.tasks)).catch(() => {});
      }
      if (cloudData.habits) {
        writeStorage("dayflow-habits", cloudData.habits);
        await db.habits.clear().then(() => db.habits.bulkAdd(cloudData.habits)).catch(() => {});
      }
      if (cloudData.events) {
        writeStorage("dayflow-events", cloudData.events);
        await db.events.clear().then(() => db.events.bulkAdd(cloudData.events)).catch(() => {});
      }
      if (cloudData.notes) {
        writeStorage("dayflow-notes", cloudData.notes);
      }
    }

    return { success: true, timestamp: new Date().toISOString() };
  } catch (err) {
    console.error("Sync error:", err);
    return { success: false, reason: err.message || "sync_failed" };
  }
}

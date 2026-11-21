import { createClient } from "@supabase/supabase-js";

let supabaseInstance = null;
let currentUrl = null;
let currentKey = null;

export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey, source: "env" };
  }

  try {
    const saved = localStorage.getItem("dayflow-supabase-config");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url, anonKey: parsed.anonKey, source: "user" };
      }
    }
  } catch {
    // ignore
  }

  return { url: null, anonKey: null, source: null };
}

export function getSupabaseClient() {
  const creds = getSupabaseCredentials();
  if (!creds.url || !creds.anonKey) {
    return null;
  }

  if (supabaseInstance && currentUrl === creds.url && currentKey === creds.anonKey) {
    return supabaseInstance;
  }

  try {
    currentUrl = creds.url;
    currentKey = creds.anonKey;
    supabaseInstance = createClient(creds.url, creds.anonKey);
    return supabaseInstance;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}

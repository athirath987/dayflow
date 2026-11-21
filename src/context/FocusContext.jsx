import { useState, useEffect } from "react";
import { FocusContext } from "./focusContextDef";
import {
  playTimerChime,
  startAmbientSound,
  stopAmbientSound,
  setAmbientVolume as updateAmbientVolume
} from "../utils/audioUtils";

export function FocusProvider({ children }) {
  const DEFAULT_SECONDS = 25 * 60;
  const [timerSeconds, setTimerSeconds] = useState(DEFAULT_SECONDS);
  const [timerRunning, setTimerRunning] = useState(false);
  const [ambientSound, setAmbientSoundState] = useState("none");
  const [ambientVolume, setAmbientVolumeState] = useState(0.3);

  // Request notification permissions gracefully
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          // Play chime
          playTimerChime();
          // Trigger browser notification
          if ("Notification" in window && Notification.permission === "granted") {
            try {
              new Notification("Focus Session Complete! 🎉", {
                body: "Great job staying focused. Take a well-deserved break.",
                icon: "/favicon.svg"
              });
            } catch {
              // fallback
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const toggleTimer = () => setTimerRunning((prev) => !prev);
  const resetTimer = (seconds = DEFAULT_SECONDS) => {
    setTimerRunning(false);
    setTimerSeconds(seconds);
  };

  const handleSetAmbientSound = (type) => {
    setAmbientSoundState(type);
    if (type === "none") {
      stopAmbientSound();
    } else {
      startAmbientSound(type, ambientVolume);
    }
  };

  const handleSetAmbientVolume = (vol) => {
    setAmbientVolumeState(vol);
    updateAmbientVolume(vol);
  };

  const formatTimer = (seconds = timerSeconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <FocusContext.Provider
      value={{
        timerSeconds,
        timerRunning,
        startTimer,
        pauseTimer,
        toggleTimer,
        resetTimer,
        formatTimer,
        ambientSound,
        setAmbientSound: handleSetAmbientSound,
        ambientVolume,
        setAmbientVolume: handleSetAmbientVolume
      }}
    >
      {children}
    </FocusContext.Provider>
  );
}

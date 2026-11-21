import { Volume2, BellRing, CloudRain, Wind, Radio } from "lucide-react";
import TimerDisplay from "./components/TimerDisplay";
import TimerControls from "./components/TimerControls";
import { useFocusTimer } from "../../hooks/useFocusTimer";
import { playTimerChime } from "../../utils/audioUtils";

const soundOptions = [
  { id: "none", label: "Silent", icon: Volume2 },
  { id: "rain", label: "Gentle Rain", icon: CloudRain },
  { id: "whitenoise", label: "White Noise", icon: Wind },
  { id: "drone", label: "Focus Drone", icon: Radio }
];

export default function FocusView() {
  const {
    resetTimer,
    timerRunning,
    ambientSound,
    setAmbientSound,
    ambientVolume,
    setAmbientVolume
  } = useFocusTimer();

  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">DEEP WORK</span>
          <h1>
            Focus mode<span className="brand-dot">.</span>
          </h1>
          <p>One task. One session. Zero distractions.</p>
        </div>
      </section>

      <section className="panel focus-panel">
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
          <button
            className="filter-chip selected"
            onClick={() => !timerRunning && resetTimer(25 * 60)}
            disabled={timerRunning}
          >
            25m Pomodoro
          </button>
          <button
            className="filter-chip"
            onClick={() => !timerRunning && resetTimer(50 * 60)}
            disabled={timerRunning}
          >
            50m Deep Session
          </button>
          <button
            className="filter-chip"
            onClick={() => !timerRunning && resetTimer(5 * 60)}
            disabled={timerRunning}
          >
            5m Short Break
          </button>
        </div>

        <TimerDisplay />
        <TimerControls />

        <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--border)", maxWidth: "460px", marginInline: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>
              Ambient Soundscape
            </span>
            <button
              className="text-button"
              style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" }}
              onClick={playTimerChime}
              title="Test completion chime"
            >
              <BellRing size={13} /> Test Chime
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "16px" }}>
            {soundOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = ambientSound === opt.id;
              return (
                <button
                  key={opt.id}
                  className={`filter-chip ${isSelected ? "selected" : ""}`}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 6px" }}
                  onClick={() => setAmbientSound(opt.id)}
                >
                  <Icon size={16} />
                  <span style={{ fontSize: "11px" }}>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {ambientSound !== "none" && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", background: "var(--surface)", borderRadius: "8px" }}>
              <Volume2 size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: "var(--accent)", cursor: "pointer" }}
                aria-label="Ambient volume"
              />
              <span style={{ fontSize: "12px", color: "var(--text-muted)", width: "32px", textAlign: "right" }}>
                {Math.round(ambientVolume * 100)}%
              </span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

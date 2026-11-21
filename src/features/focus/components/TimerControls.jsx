import { Play, Pause, RotateCcw } from "lucide-react";
import { useFocusTimer } from "../../../hooks/useFocusTimer";

export default function TimerControls() {
  const { timerRunning, toggleTimer, resetTimer } = useFocusTimer();

  return (
    <div className="timer-actions">
      <button className="primary-button" onClick={toggleTimer}>
        {timerRunning ? <Pause size={16} /> : <Play size={16} />}
        {timerRunning ? "Pause" : "Start focus"}
      </button>
      <button className="secondary-button" onClick={() => resetTimer(25 * 60)}>
        <RotateCcw size={16} /> Reset
      </button>
    </div>
  );
}

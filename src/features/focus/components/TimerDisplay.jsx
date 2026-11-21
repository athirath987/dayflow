import { useFocusTimer } from "../../../hooks/useFocusTimer";

export default function TimerDisplay() {
  const { formatTimer } = useFocusTimer();

  return <div className="timer-display">{formatTimer()}</div>;
}

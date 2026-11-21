import { Timer } from "lucide-react";
import TimerDisplay from "../../focus/components/TimerDisplay";
import TimerControls from "../../focus/components/TimerControls";

export default function FocusMiniWidget() {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Focus timer</h2>
          <p>Make time for deep work.</p>
        </div>
        <Timer size={20} />
      </div>
      <TimerDisplay />
      <TimerControls />
    </section>
  );
}

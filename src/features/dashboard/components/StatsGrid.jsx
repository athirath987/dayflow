import StatCard from "../../../components/common/StatCard";
import { useTasks } from "../../../hooks/useTasks";
import { useHabits } from "../../../hooks/useHabits";
import { useEvents } from "../../../hooks/useEvents";

export default function StatsGrid() {
  const { pendingTasks, completedTasks } = useTasks();
  const { completedTodayCount, totalHabitsCount } = useHabits();
  const { events } = useEvents();

  return (
    <section className="stats-grid">
      <StatCard
        label="Pending tasks"
        value={pendingTasks.length}
        subtext="Tasks waiting for you"
      />
      <StatCard
        label="Completed"
        value={completedTasks.length}
        subtext="You've made progress"
      />
      <StatCard
        label="Habits completed"
        value={`${completedTodayCount}/${totalHabitsCount}`}
        subtext="Today's habit progress"
      />
      <StatCard
        label="Calendar events"
        value={events.length}
        subtext="Saved events"
      />
    </section>
  );
}

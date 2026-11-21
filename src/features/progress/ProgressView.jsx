import { CheckCircle, Award } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import { useHabits } from "../../hooks/useHabits";
import { useEvents } from "../../hooks/useEvents";
import StatCard from "../../components/common/StatCard";

export default function ProgressView() {
  const { tasks, pendingTasks, completedTasks } = useTasks();
  const { habits, completedTodayCount, totalHabitsCount, getStreak } = useHabits();
  const { events } = useEvents();

  const taskCompletionRate =
    tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const habitCompletionRate =
    totalHabitsCount > 0 ? Math.round((completedTodayCount / totalHabitsCount) * 100) : 0;

  const bestStreak = habits.reduce((max, h) => Math.max(max, getStreak(h.id)), 0);

  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">ANALYTICS & INSIGHTS</span>
          <h1>
            Your Progress<span className="brand-dot">.</span>
          </h1>
          <p>Track your productivity, consistency, and momentum over time.</p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          label="Task Completion"
          value={`${taskCompletionRate}%`}
          subtext={`${completedTasks.length} of ${tasks.length} finished`}
        />
        <StatCard
          label="Habit Consistency"
          value={`${habitCompletionRate}%`}
          subtext={`${completedTodayCount} of ${totalHabitsCount} completed today`}
        />
        <StatCard
          label="Best Habit Streak"
          value={`${bestStreak} days`}
          subtext="Consecutive days maintained"
        />
        <StatCard
          label="Active Events"
          value={events.length}
          subtext="Scheduled on your calendar"
        />
      </section>

      <div className="dashboard-grid" style={{ marginTop: "20px" }}>
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Task Health</h2>
              <p>Breakdown of workspace activities</p>
            </div>
            <CheckCircle size={20} color="var(--accent)" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "14px" }}>
                <span>Completion Progress</span>
                <strong>{taskCompletionRate}%</strong>
              </div>
              <div style={{ height: "8px", background: "var(--surface-hover)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${taskCompletionRate}%`, height: "100%", background: "var(--accent)", borderRadius: "4px", transition: "width 0.4s" }} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "var(--surface-hover)", borderRadius: "8px", fontSize: "14px" }}>
              <span>Pending Tasks</span>
              <strong>{pendingTasks.length}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "var(--surface-hover)", borderRadius: "8px", fontSize: "14px" }}>
              <span>High Priority Tasks</span>
              <strong style={{ color: "var(--red)" }}>{tasks.filter((t) => t.priority === "High" && t.status === "pending").length}</strong>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Consistency Streaks</h2>
              <p>Habits maintained over time</p>
            </div>
            <Award size={20} color="#ff7185" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
            {habits.map((habit) => {
              const streak = getStreak(habit.id);
              return (
                <div
                  key={habit.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "var(--surface-hover)",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}
                >
                  <span>{habit.name}</span>
                  <span style={{ fontWeight: 600, color: streak > 0 ? "#ff7185" : "var(--text-muted)" }}>
                    {streak} day{streak === 1 ? "" : "s"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

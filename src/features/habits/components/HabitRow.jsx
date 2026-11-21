import { Flame, Trash2, Pencil } from "lucide-react";
import { useHabits } from "../../../hooks/useHabits";

export default function HabitRow({ habit, onEdit, onDeleteRequest }) {
  const { isHabitDoneToday, toggleHabitToday, getStreak } = useHabits();
  const isDone = isHabitDoneToday(habit.id);
  const streak = getStreak(habit.id);

  return (
    <div
      className="habit-row"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        borderRadius: "8px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        marginBottom: "8px"
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
          flex: 1
        }}
      >
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => toggleHabitToday(habit.id)}
          aria-label={`Toggle habit ${habit.name}`}
        />
        <span
          style={{
            textDecoration: isDone ? "line-through" : "none",
            opacity: isDone ? 0.6 : 1,
            fontWeight: 500
          }}
        >
          {habit.name}
        </span>
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {streak > 0 && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              padding: "2px 8px",
              borderRadius: "12px",
              background: "rgba(255, 113, 133, 0.15)",
              color: "#ff7185",
              fontWeight: 600
            }}
            title={`${streak} day streak`}
          >
            <Flame size={13} fill="#ff7185" />
            {streak}d
          </span>
        )}

        {onEdit && (
          <button
            className="icon-button"
            style={{ width: "28px", height: "28px" }}
            title="Edit habit"
            onClick={() => onEdit(habit)}
            aria-label="Edit habit"
          >
            <Pencil size={13} />
          </button>
        )}

        {onDeleteRequest && (
          <button
            className="icon-button"
            style={{ width: "28px", height: "28px" }}
            title="Delete habit"
            onClick={() => onDeleteRequest(habit)}
            aria-label="Delete habit"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

import { memo, useState } from "react";
import { Check, Circle, CalendarDays, Pencil, RotateCcw, Pause, Trash2, CheckSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useTasks } from "../../../hooks/useTasks";

const TaskCard = memo(function TaskCard({ task, onEdit, onDeleteRequest }) {
  const { toggleTask, postponeTask, toggleHold, toggleSubtask } = useTasks();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const isCompleted = task.status === "completed";

  const subtasks = task.subtasks || [];
  const completedSubtasksCount = subtasks.filter((st) => st.completed).length;

  return (
    <div className={`task-card ${isCompleted ? "completed" : ""}`}>
      <button
        className="task-check"
        onClick={() => toggleTask(task.id)}
        title="Toggle completion"
        aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
      >
        {isCompleted ? <Check size={16} /> : <Circle size={16} />}
      </button>

      <div className="task-content">
        <h4>{task.title}</h4>
        {task.description && <p>{task.description}</p>}

        <div className="task-meta">
          <span className={`priority ${(task.priority || "medium").toLowerCase()}`}>
            {task.priority || "Medium"}
          </span>

          {task.dueDate && (
            <span className="task-date">
              <CalendarDays size={13} /> {task.dueDate}
            </span>
          )}

          {task.held && <span className="priority low">On hold</span>}

          {subtasks.length > 0 && (
            <button
              type="button"
              className="text-button"
              onClick={() => setShowSubtasks(!showSubtasks)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: "var(--accent)",
                padding: "2px 6px",
                background: "var(--surface)",
                borderRadius: "4px",
                border: "1px solid var(--border)"
              }}
            >
              <CheckSquare size={12} />
              {completedSubtasksCount}/{subtasks.length} subtasks
              {showSubtasks ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>

        {showSubtasks && subtasks.length > 0 && (
          <div style={{ marginTop: "10px", padding: "8px 12px", background: "rgba(10, 11, 16, 0.6)", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {subtasks.map((st) => (
              <label key={st.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={Boolean(st.completed)}
                  onChange={() => toggleSubtask(task.id, st.id)}
                  style={{ accentColor: "var(--accent)" }}
                />
                <span style={{ textDecoration: st.completed ? "line-through" : "none", opacity: st.completed ? 0.6 : 1 }}>
                  {st.text}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="task-actions">
        <button
          title="Edit task"
          aria-label="Edit task"
          onClick={() => onEdit(task)}
        >
          <Pencil size={15} />
        </button>
        <button
          title="Postpone until tomorrow"
          aria-label="Postpone until tomorrow"
          onClick={() => postponeTask(task.id)}
        >
          <RotateCcw size={15} />
        </button>
        <button
          title={task.held ? "Resume task" : "Put task on hold"}
          aria-label={task.held ? "Resume task" : "Put task on hold"}
          onClick={() => toggleHold(task.id)}
        >
          <Pause size={15} />
        </button>
        <button
          title="Delete task"
          aria-label="Delete task"
          onClick={() => onDeleteRequest(task)}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
});

export default TaskCard;

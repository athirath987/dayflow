import { CheckSquare, CalendarDays, Clock, Pencil, Trash2, Plus, Check, Circle } from "lucide-react";
import { formatDisplayDate } from "../../../utils/dateUtils";
import { useEvents } from "../../../hooks/useEvents";
import { useTasks } from "../../../hooks/useTasks";

export default function AgendaPanel({ onOpenNewEvent, onOpenEditEvent, onDeleteEventRequest }) {
  const { selectedDate, getEventsForDate } = useEvents();
  const { tasks, toggleTask } = useTasks();

  const selectedTasks = tasks.filter((task) => task.dueDate === selectedDate);
  const selectedEvents = getEventsForDate(selectedDate);
  const displayDate = formatDisplayDate(selectedDate);

  return (
    <section className="panel agenda-panel">
      <div className="agenda-heading">
        <span className="eyebrow">DAILY AGENDA</span>
        <h2>{displayDate}</h2>
      </div>

      <div className="agenda-section">
        <h3>
          <CheckSquare size={16} /> Tasks due <span>{selectedTasks.length}</span>
        </h3>
        {selectedTasks.length > 0 ? (
          selectedTasks.map((task) => {
            const isCompleted = task.status === "completed";
            return (
              <div className="agenda-item" key={task.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  className="task-check"
                  onClick={() => toggleTask(task.id)}
                  title="Toggle completion"
                  style={{ width: "22px", height: "22px", flexShrink: 0 }}
                  aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
                >
                  {isCompleted ? <Check size={14} /> : <Circle size={14} />}
                </button>
                <span className={`priority ${(task.priority || "medium").toLowerCase()}`}>
                  {task.priority || "Medium"}
                </span>
                <div className="agenda-item-content" style={{ flex: 1 }}>
                  <strong style={{ textDecoration: isCompleted ? "line-through" : "none", opacity: isCompleted ? 0.6 : 1 }}>
                    {task.title}
                  </strong>
                  <p>{isCompleted ? "Completed" : task.held ? "On hold" : "Pending"}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="muted agenda-empty">No tasks due on this date.</p>
        )}
      </div>

      <div className="agenda-section">
        <h3>
          <CalendarDays size={16} /> Events <span>{selectedEvents.length}</span>
        </h3>
        {selectedEvents.length > 0 ? (
          selectedEvents.map((event) => (
            <div className="agenda-item event-agenda-item" key={event.id}>
              <span className="event-indicator" />
              <div className="agenda-item-content">
                <strong>{event.title}</strong>
                {event.time && (
                  <p>
                    <Clock size={12} /> {event.time}
                  </p>
                )}
                {event.description && <p>{event.description}</p>}
              </div>
              <div className="event-actions">
                <button
                  title="Edit event"
                  aria-label="Edit event"
                  onClick={() => onOpenEditEvent(event)}
                >
                  <Pencil size={14} />
                </button>
                <button
                  title="Delete event"
                  aria-label="Delete event"
                  onClick={() => onDeleteEventRequest(event)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="muted agenda-empty">No events scheduled.</p>
        )}
      </div>

      <button className="secondary-button add-event-button" onClick={onOpenNewEvent}>
        <Plus size={16} /> Add event on this date
      </button>
    </section>
  );
}

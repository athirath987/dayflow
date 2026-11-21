import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getCalendarCells,
  formatMonthYear,
  changeMonth,
  todayString
} from "../../../utils/dateUtils";
import { useEvents } from "../../../hooks/useEvents";
import { useTasks } from "../../../hooks/useTasks";

export default function CalendarGrid() {
  const { calendarDate, setCalendarDate, selectedDate, setSelectedDate, events } = useEvents();
  const { tasks } = useTasks();

  const cells = getCalendarCells(calendarDate);
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const today = todayString();

  const handlePrevMonth = () => setCalendarDate((prev) => changeMonth(prev, -1));
  const handleNextMonth = () => setCalendarDate((prev) => changeMonth(prev, 1));
  const handleToday = () => {
    setCalendarDate(new Date());
    setSelectedDate(today);
  };

  const handleSelectDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
  };

  return (
    <section className="panel calendar-panel">
      <div className="calendar-header">
        <div>
          <h2>{formatMonthYear(calendarDate)}</h2>
          <p>Select a date to view its schedule.</p>
        </div>
        <div className="calendar-controls">
          <button
            className="icon-button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft size={19} />
          </button>
          <button className="secondary-button today-button" onClick={handleToday}>
            Today
          </button>
          <button
            className="icon-button"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div className="calendar-weekday" key={day}>
            {day}
          </div>
        ))}

        {cells.map((day, index) => {
          if (!day) {
            return <div className="calendar-day empty" key={`blank-${index}`} />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const hasTasks = tasks.some((task) => task.dueDate === dateStr);
          const hasEvents = events.some((event) => event.date === dateStr);

          return (
            <button
              key={dateStr}
              className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
              onClick={() => handleSelectDay(day)}
              aria-label={`Date ${dateStr}`}
            >
              <span>{day}</span>
              <div className="calendar-dots">
                {hasTasks && <i className="task-dot" />}
                {hasEvents && <i className="event-dot" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="calendar-legend">
        <span>
          <i className="task-dot" /> Tasks
        </span>
        <span>
          <i className="event-dot" /> Events
        </span>
      </div>
    </section>
  );
}


import { useEffect, useState } from "react";
import {
  LayoutDashboard, CheckSquare, CalendarDays, Target,
  Timer, BookOpen, TrendingUp, Plus, Search, Bell,
  Settings, Menu, X, Check, Circle, Trash2, Pencil,
  Pause, RotateCcw, ChevronLeft, ChevronRight, Play,
  Clock, CalendarPlus
} from "lucide-react";
import "./index.css";

const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const defaultTasks = [
  {
    id: 1,
    title: "Practice Java inheritance",
    description: "Revise inheritance and method overriding.",
    priority: "High",
    dueDate: "",
    status: "pending",
    held: false,
  },
  {
    id: 2,
    title: "Solve DSA problems",
    description: "Complete two array questions.",
    priority: "Medium",
    dueDate: "",
    status: "pending",
    held: false,
  },
];

const defaultHabits = [
  { id: 1, name: "Workout", done: false },
  { id: 2, name: "Java practice", done: false },
  { id: 3, name: "Read 10 pages", done: false },
  { id: 4, name: "Drink enough water", done: false },
];

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [tasks, setTasks] = useState(() => readStorage("dayflow-tasks", defaultTasks));
  const [habits, setHabits] = useState(() => readStorage("dayflow-habits", defaultHabits));
  const [events, setEvents] = useState(() => readStorage("dayflow-events", []));

  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(todayString());

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    time: "",
    description: "",
  });

  const [taskFilter, setTaskFilter] = useState("All");
  const [taskSearch, setTaskSearch] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("dayflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("dayflow-habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("dayflow-events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending" && !task.held
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  );

  const openNewTask = () => {
    setEditingTaskId(null);
    setTaskForm({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
    });
    setShowTaskModal(true);
  };

  const openEditTask = (task) => {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate || "",
    });
    setShowTaskModal(true);
  };

  const saveTask = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    if (editingTaskId !== null) {
      setTasks((old) =>
        old.map((task) =>
          task.id === editingTaskId ? { ...task, ...taskForm } : task
        )
      );
    } else {
      setTasks((old) => [
        {
          id: Date.now(),
          ...taskForm,
          status: "pending",
          held: false,
        },
        ...old,
      ]);
    }

    setShowTaskModal(false);
    setEditingTaskId(null);
  };

  const toggleTask = (id) => {
    setTasks((old) =>
      old.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed",
              held: false,
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    if (window.confirm("Delete this task permanently?")) {
      setTasks((old) => old.filter((task) => task.id !== id));
    }
  };

  const postponeTask = (id) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const date = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

    setTasks((old) =>
      old.map((task) =>
        task.id === id ? { ...task, dueDate: date, held: false } : task
      )
    );
  };

  const toggleHold = (id) => {
    setTasks((old) =>
      old.map((task) =>
        task.id === id ? { ...task, held: !task.held } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(taskSearch.toLowerCase());

    let matchesFilter = true;

    if (taskFilter === "Pending") {
      matchesFilter = task.status === "pending" && !task.held;
    } else if (taskFilter === "Completed") {
      matchesFilter = task.status === "completed";
    } else if (taskFilter === "High Priority") {
      matchesFilter =
        task.priority === "High" &&
        task.status === "pending" &&
        !task.held;
    } else if (taskFilter === "On Hold") {
      matchesFilter = task.held;
    }

    return matchesSearch && matchesFilter;
  });

  // Calendar calculations
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const numberOfDays = new Date(year, month + 1, 0).getDate();

  const calendarCells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: numberOfDays }, (_, index) => index + 1),
  ];

  const changeMonth = (amount) => {
    setCalendarDate(new Date(year, month + amount, 1));
  };

  const selectCalendarDate = (day) => {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(date);
  };

  const selectedTasks = tasks.filter(
    (task) => task.dueDate === selectedDate
  );

  const selectedEvents = events
    .filter((event) => event.date === selectedDate)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  const openNewEvent = () => {
    setEditingEventId(null);
    setEventForm({ title: "", time: "", description: "" });
    setShowEventForm(true);
  };

  const openEditEvent = (event) => {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title,
      time: event.time || "",
      description: event.description || "",
    });
    setShowEventForm(true);
  };

  const saveEvent = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    if (editingEventId !== null) {
      setEvents((old) =>
        old.map((event) =>
          event.id === editingEventId
            ? { ...event, ...eventForm, date: selectedDate }
            : event
        )
      );
    } else {
      setEvents((old) => [
        ...old,
        {
          id: Date.now(),
          ...eventForm,
          date: selectedDate,
        },
      ]);
    }

    setShowEventForm(false);
    setEditingEventId(null);
  };

  const deleteEvent = (id) => {
    if (window.confirm("Delete this event?")) {
      setEvents((old) => old.filter((event) => event.id !== id));
    }
  };

  const navItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Tasks", icon: CheckSquare },
    { name: "Calendar", icon: CalendarDays },
    { name: "Habits", icon: Target },
    { name: "Focus", icon: Timer },
    { name: "Notes", icon: BookOpen },
    { name: "Progress", icon: TrendingUp },
  ];

  const formatTimer = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const formattedSelectedDate = new Date(
    `${selectedDate}T00:00:00`
  ).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function TaskCard({ task }) {
    return (
      <div className={`task-card ${task.status === "completed" ? "completed" : ""}`}>
        <button
          className="task-check"
          onClick={() => toggleTask(task.id)}
          title="Toggle completion"
        >
          {task.status === "completed" ? <Check size={16} /> : <Circle size={16} />}
        </button>

        <div className="task-content">
          <h4>{task.title}</h4>
          {task.description && <p>{task.description}</p>}
          <div className="task-meta">
            <span className={`priority ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="task-date">
                <CalendarDays size={13} /> {task.dueDate}
              </span>
            )}
            {task.held && <span className="priority low">On hold</span>}
          </div>
        </div>

        <div className="task-actions">
          <button title="Edit task" onClick={() => openEditTask(task)}>
            <Pencil size={15} />
          </button>
          <button title="Postpone until tomorrow" onClick={() => postponeTask(task.id)}>
            <RotateCcw size={15} />
          </button>
          <button title="Hold or resume" onClick={() => toggleHold(task.id)}>
            <Pause size={15} />
          </button>
          <button title="Delete task" onClick={() => deleteTask(task.id)}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {mobileNavOpen && (
        <div className="mobile-overlay" onClick={() => setMobileNavOpen(false)} />
      )}

      <aside className={`sidebar ${mobileNavOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">D</div>
          <span>dayflow<span className="brand-dot">.</span></span>
          <button className="mobile-close" onClick={() => setMobileNavOpen(false)}>
            <X size={19} />
          </button>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={`nav-item ${activePage === item.name ? "active" : ""}`}
                onClick={() => {
                  setActivePage(item.name);
                  setMobileNavOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.name}</span>
                {item.name === "Tasks" && (
                  <span className="nav-count">{pendingTasks.length}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">A</div>
            <div>
              <strong>My Workspace</strong>
              <span>Personal account</span>
            </div>
            <Settings size={17} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" onClick={() => setMobileNavOpen(true)}>
              <Menu size={20} />
            </button>
            <span className="breadcrumb">Workspace /</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <span className="today-label">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>
            <button className="icon-button" title="Notifications">
              <Bell size={18} />
            </button>
            <div className="avatar small-avatar">A</div>
          </div>
        </header>

        <div className="page-content">
          {activePage === "Overview" && (
            <>
              <section className="page-heading">
                <div>
                  <span className="eyebrow">YOUR PERSONAL WORKSPACE</span>
                  <h1>Make today count<span className="brand-dot">.</span></h1>
                  <p>A little progress every day adds up to big results.</p>
                </div>
                <button className="primary-button" onClick={openNewTask}>
                  <Plus size={18} /> Add task
                </button>
              </section>

              <section className="stats-grid">
                <div className="stat-card">
                  <span>Pending tasks</span>
                  <strong>{pendingTasks.length}</strong>
                  <small>Tasks waiting for you</small>
                </div>
                <div className="stat-card">
                  <span>Completed</span>
                  <strong>{completedTasks.length}</strong>
                  <small>You've made progress</small>
                </div>
                <div className="stat-card">
                  <span>Habits completed</span>
                  <strong>{habits.filter((habit) => habit.done).length}/{habits.length}</strong>
                  <small>Today's habit progress</small>
                </div>
                <div className="stat-card">
                  <span>Calendar events</span>
                  <strong>{events.length}</strong>
                  <small>Saved events</small>
                </div>
              </section>

              <div className="dashboard-grid">
                <section className="panel">
                  <div className="panel-header">
                    <div><h2>Today's tasks</h2><p>Your next steps.</p></div>
                    <button className="text-button" onClick={() => setActivePage("Tasks")}>View all →</button>
                  </div>
                  <div className="task-list">
                    {pendingTasks.slice(0, 4).map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    {pendingTasks.length === 0 && <p className="muted">You're all caught up!</p>}
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-header">
                    <div><h2>Focus timer</h2><p>Make time for deep work.</p></div>
                    <Timer size={20} />
                  </div>
                  <div className="timer-display">{formatTimer(timerSeconds)}</div>
                  <div className="timer-actions">
                    <button className="primary-button" onClick={() => setTimerRunning(!timerRunning)}>
                      {timerRunning ? "Pause" : "Start focus"}
                    </button>
                    <button className="secondary-button" onClick={() => { setTimerRunning(false); setTimerSeconds(25 * 60); }}>
                      Reset
                    </button>
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-header">
                    <div><h2>Daily habits</h2><p>Small wins matter.</p></div>
                    <button className="text-button" onClick={() => setActivePage("Habits")}>View all →</button>
                  </div>
                  {habits.map((habit) => (
                    <label className="habit-row" key={habit.id}>
                      <input
                        type="checkbox"
                        checked={habit.done}
                        onChange={() => setHabits((old) => old.map((h) => h.id === habit.id ? { ...h, done: !h.done } : h))}
                      />
                      <span>{habit.name}</span>
                    </label>
                  ))}
                </section>
              </div>
            </>
          )}

          {activePage === "Tasks" && (
            <>
              <section className="page-heading">
                <div>
                  <span className="eyebrow">YOUR WORKSPACE</span>
                  <h1>Manage your tasks<span className="brand-dot">.</span></h1>
                  <p>Break things down. Get things done.</p>
                </div>
                <button className="primary-button" onClick={openNewTask}>
                  <Plus size={18} /> New task
                </button>
              </section>

              <section className="stats-grid task-stats">
                <div className="stat-card"><span>Total tasks</span><strong>{tasks.length}</strong><small>Across your workspace</small></div>
                <div className="stat-card"><span>Pending</span><strong>{pendingTasks.length}</strong><small>Ready to work on</small></div>
                <div className="stat-card"><span>Completed</span><strong>{completedTasks.length}</strong><small>Tasks finished</small></div>
                <div className="stat-card"><span>On hold</span><strong>{tasks.filter((task) => task.held).length}</strong><small>Temporarily paused</small></div>
              </section>

              <section className="panel task-panel">
                <div className="panel-header task-panel-header">
                  <div><h2>Your tasks</h2><p>Keep track of everything that matters.</p></div>
                  <div className="task-search">
                    <Search size={16} />
                    <input placeholder="Search tasks..." value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)} />
                  </div>
                </div>

                <div className="filter-row">
                  {["All", "Pending", "Completed", "High Priority", "On Hold"].map((item) => (
                    <button key={item} className={`filter-chip ${taskFilter === item ? "selected" : ""}`} onClick={() => setTaskFilter(item)}>
                      {item}
                    </button>
                  ))}
                </div>

                <div className="task-list">
                  {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  )) : (
                    <div className="empty-state">
                      <CheckSquare size={30} />
                      <h3>No tasks found</h3>
                      <p>Try another filter or create a new task.</p>
                      <button className="primary-button" onClick={openNewTask}><Plus size={16} /> Create task</button>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {activePage === "Calendar" && (
            <>
              <section className="page-heading">
                <div>
                  <span className="eyebrow">PLAN YOUR TIME</span>
                  <h1>Your calendar<span className="brand-dot">.</span></h1>
                  <p>Tasks, events and important dates in one place.</p>
                </div>
                <button className="primary-button" onClick={openNewEvent}>
                  <CalendarPlus size={18} /> Add event
                </button>
              </section>

              <div className="calendar-layout">
                <section className="panel calendar-panel">
                  <div className="calendar-header">
                    <div>
                      <h2>{calendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h2>
                      <p>Select a date to view its schedule.</p>
                    </div>
                    <div className="calendar-controls">
                      <button className="icon-button" onClick={() => changeMonth(-1)} aria-label="Previous month"><ChevronLeft size={19} /></button>
                      <button className="secondary-button today-button" onClick={() => { setCalendarDate(new Date()); setSelectedDate(todayString()); }}>Today</button>
                      <button className="icon-button" onClick={() => changeMonth(1)} aria-label="Next month"><ChevronRight size={19} /></button>
                    </div>
                  </div>

                  <div className="calendar-grid">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div className="calendar-weekday" key={day}>{day}</div>
                    ))}

                    {calendarCells.map((day, index) => {
                      if (!day) return <div className="calendar-day empty" key={`blank-${index}`} />;

                      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const isToday = date === todayString();
                      const isSelected = date === selectedDate;
                      const hasTasks = tasks.some((task) => task.dueDate === date);
                      const hasEvents = events.some((event) => event.date === date);

                      return (
                        <button
                          key={date}
                          className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                          onClick={() => selectCalendarDate(day)}
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
                    <span><i className="task-dot" /> Tasks</span>
                    <span><i className="event-dot" /> Events</span>
                  </div>
                </section>

                <section className="panel agenda-panel">
                  <div className="agenda-heading">
                    <span className="eyebrow">DAILY AGENDA</span>
                    <h2>{formattedSelectedDate}</h2>
                  </div>

                  <div className="agenda-section">
                    <h3><CheckSquare size={16} /> Tasks due <span>{selectedTasks.length}</span></h3>
                    {selectedTasks.length ? selectedTasks.map((task) => (
                      <div className="agenda-item" key={task.id}>
                        <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                        <div className="agenda-item-content">
                          <strong>{task.title}</strong>
                          <p>{task.status === "completed" ? "Completed" : task.held ? "On hold" : "Pending"}</p>
                        </div>
                      </div>
                    )) : <p className="muted agenda-empty">No tasks due on this date.</p>}
                  </div>

                  <div className="agenda-section">
                    <h3><CalendarDays size={16} /> Events <span>{selectedEvents.length}</span></h3>
                    {selectedEvents.length ? selectedEvents.map((event) => (
                      <div className="agenda-item event-agenda-item" key={event.id}>
                        <span className="event-indicator" />
                        <div className="agenda-item-content">
                          <strong>{event.title}</strong>
                          {event.time && <p><Clock size={12} /> {event.time}</p>}
                          {event.description && <p>{event.description}</p>}
                        </div>
                        <div className="event-actions">
                          <button title="Edit event" onClick={() => openEditEvent(event)}><Pencil size={14} /></button>
                          <button title="Delete event" onClick={() => deleteEvent(event.id)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    )) : <p className="muted agenda-empty">No events scheduled.</p>}
                  </div>

                  <button className="secondary-button add-event-button" onClick={openNewEvent}>
                    <Plus size={16} /> Add event on this date
                  </button>
                </section>
              </div>
            </>
          )}

          {activePage === "Habits" && (
            <>
              <section className="page-heading">
                <div><span className="eyebrow">CONSISTENCY BUILDS RESULTS</span><h1>Daily habits<span className="brand-dot">.</span></h1><p>Show up for yourself every day.</p></div>
              </section>
              <section className="panel">
                <div className="panel-header"><div><h2>Today's habits</h2><p>{habits.filter((habit) => habit.done).length} of {habits.length} completed</p></div></div>
                {habits.map((habit) => (
                  <label className="habit-row" key={habit.id}>
                    <input type="checkbox" checked={habit.done} onChange={() => setHabits((old) => old.map((h) => h.id === habit.id ? { ...h, done: !h.done } : h))} />
                    <span>{habit.name}</span>
                  </label>
                ))}
              </section>
            </>
          )}

          {activePage === "Focus" && (
            <>
              <section className="page-heading">
                <div><span className="eyebrow">DEEP WORK</span><h1>Focus mode<span className="brand-dot">.</span></h1><p>One task. One session. No distractions.</p></div>
              </section>
              <section className="panel focus-panel">
                <div className="timer-display">{formatTimer(timerSeconds)}</div>
                <div className="timer-actions">
                  <button className="primary-button" onClick={() => setTimerRunning(!timerRunning)}>
                    {timerRunning ? <Pause size={16} /> : <Play size={16} />}
                    {timerRunning ? "Pause" : "Start focus"}
                  </button>
                  <button className="secondary-button" onClick={() => { setTimerRunning(false); setTimerSeconds(25 * 60); }}>
                    <RotateCcw size={16} /> Reset
                  </button>
                </div>
              </section>
            </>
          )}

          {["Notes", "Progress"].includes(activePage) && (
            <section className="page-heading">
              <div><span className="eyebrow">COMING NEXT</span><h1>{activePage}<span className="brand-dot">.</span></h1><p>This module is coming in the next build.</p></div>
            </section>
          )}
        </div>
      </main>

      {showTaskModal && (
        <div className="modal-backdrop" onClick={() => setShowTaskModal(false)}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div><span className="eyebrow">{editingTaskId ? "UPDATE YOUR WORK" : "MAKE IT HAPPEN"}</span><h2>{editingTaskId ? "Edit task" : "Create a task"}</h2></div>
              <button className="icon-button" onClick={() => setShowTaskModal(false)}><X size={19} /></button>
            </div>
            <form onSubmit={saveTask}>
              <label>Task title *</label>
              <input required autoFocus placeholder="What do you need to do?" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
              <label>Description</label>
              <textarea rows={3} placeholder="Add a little detail..." value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
              <label>Priority</label>
              <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
              <label>Due date</label>
              <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="primary-button">{editingTaskId ? "Save changes" : "Create task"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEventForm && (
        <div className="modal-backdrop" onClick={() => setShowEventForm(false)}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div><span className="eyebrow">YOUR SCHEDULE</span><h2>{editingEventId ? "Edit event" : "Create an event"}</h2></div>
              <button className="icon-button" onClick={() => setShowEventForm(false)}><X size={19} /></button>
            </div>
            <form onSubmit={saveEvent}>
              <label>Event title *</label>
              <input required autoFocus placeholder="What is happening?" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
              <label>Date</label>
              <input type="date" required value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              <label>Time (optional)</label>
              <input type="time" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} />
              <label>Description (optional)</label>
              <textarea rows={3} placeholder="Add event details..." value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setShowEventForm(false)}>Cancel</button>
                <button type="submit" className="primary-button">{editingEventId ? "Save changes" : "Create event"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

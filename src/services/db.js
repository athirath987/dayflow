import Dexie from "dexie";

export const db = new Dexie("DayFlowDB");

db.version(1).stores({
  tasks: "++id, title, status, priority, dueDate, held, updatedAt",
  events: "++id, title, date, time, description, updatedAt",
  habits: "++id, name, frequency, createdAt, updatedAt",
  habitLogs: "[habitId+date], habitId, date, completed",
  notes: "++id, title, content, updatedAt"
});

export const defaultTasks = [
  {
    id: 1,
    title: "Practice Java inheritance",
    description: "Revise inheritance and method overriding.",
    priority: "High",
    dueDate: "",
    status: "pending",
    held: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Solve DSA problems",
    description: "Complete two array questions.",
    priority: "Medium",
    dueDate: "",
    status: "pending",
    held: false,
    updatedAt: new Date().toISOString()
  }
];

export const defaultHabits = [
  { id: 1, name: "Workout", history: {} },
  { id: 2, name: "Java practice", history: {} },
  { id: 3, name: "Read 10 pages", history: {} },
  { id: 4, name: "Drink enough water", history: {} }
];

export function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Storage error:", err);
  }
}

// Migrate localStorage data to Dexie if Dexie tables are empty
export async function initializeDatabase() {
  try {
    const taskCount = await db.tasks.count();
    if (taskCount === 0) {
      const storedTasks = readStorage("dayflow-tasks", defaultTasks);
      await db.tasks.bulkAdd(storedTasks);
    }

    const eventCount = await db.events.count();
    if (eventCount === 0) {
      const storedEvents = readStorage("dayflow-events", []);
      if (storedEvents.length > 0) {
        await db.events.bulkAdd(storedEvents);
      }
    }

    const habitCount = await db.habits.count();
    if (habitCount === 0) {
      const storedHabits = readStorage("dayflow-habits", defaultHabits);
      // Ensure habit history object exists for each habit
      const normalizedHabits = storedHabits.map((h) => ({
        id: h.id,
        name: h.name,
        history: h.history || (h.done ? { [new Date().toISOString().slice(0, 10)]: true } : {})
      }));
      await db.habits.bulkAdd(normalizedHabits);
    }
  } catch (error) {
    console.warn("IndexedDB initialization warning:", error);
  }
}

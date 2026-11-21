import { useState, useEffect } from "react";
import { TaskContext } from "./taskContextDef";
import { readStorage, writeStorage, defaultTasks, db } from "../services/db";
import { getTomorrowString } from "../utils/dateUtils";

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => readStorage("dayflow-tasks", defaultTasks));
  const [taskFilter, setTaskFilter] = useState("All");
  const [taskSearch, setTaskSearch] = useState("");

  useEffect(() => {
    writeStorage("dayflow-tasks", tasks);
    try {
      db.tasks.clear().then(() => db.tasks.bulkAdd(tasks)).catch(() => {});
    } catch {
      // fallback silent
    }
  }, [tasks]);

  const pendingTasks = tasks.filter((t) => t.status === "pending" && !t.held);
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      title: taskData.title.trim(),
      description: taskData.description || "",
      priority: taskData.priority || "Medium",
      dueDate: taskData.dueDate || "",
      subtasks: taskData.subtasks || [],
      status: "pending",
      held: false,
      updatedAt: new Date().toISOString()
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id, taskData) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...taskData,
              title: taskData.title.trim(),
              updatedAt: new Date().toISOString()
            }
          : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "completed" ? "pending" : "completed",
              held: false,
              updatedAt: new Date().toISOString()
            }
          : t
      )
    );
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = (t.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return {
          ...t,
          subtasks: updatedSubtasks,
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const postponeTask = (id) => {
    const tomorrow = getTomorrowString();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              dueDate: tomorrow,
              held: false,
              updatedAt: new Date().toISOString()
            }
          : t
      )
    );
  };

  const toggleHold = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              held: !t.held,
              updatedAt: new Date().toISOString()
            }
          : t
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
      matchesFilter = task.priority === "High" && task.status === "pending" && !task.held;
    } else if (taskFilter === "On Hold") {
      matchesFilter = task.held;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        pendingTasks,
        completedTasks,
        filteredTasks,
        taskFilter,
        setTaskFilter,
        taskSearch,
        setTaskSearch,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        toggleSubtask,
        postponeTask,
        toggleHold
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

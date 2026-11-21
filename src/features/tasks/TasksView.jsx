import { useState } from "react";
import { Plus, Search, CheckSquare, ArrowUpDown } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import { sortTasks } from "../../utils/taskUtils";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import StatCard from "../../components/common/StatCard";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const filterOptions = ["All", "Pending", "Completed", "High Priority", "On Hold"];
const sortOptions = ["Newest", "Due Date", "Priority", "Title"];

export default function TasksView() {
  const {
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
    deleteTask
  } = useTasks();

  const [sortBy, setSortBy] = useState("Newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = (formData) => {
    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
  };

  const sortedTasks = sortTasks(filteredTasks, sortBy);

  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">YOUR WORKSPACE</span>
          <h1>
            Manage your tasks<span className="brand-dot">.</span>
          </h1>
          <p>Break things down. Get things done.</p>
        </div>
        <button className="primary-button" onClick={handleOpenCreate}>
          <Plus size={18} /> New task
        </button>
      </section>

      <section className="stats-grid task-stats">
        <StatCard
          label="Total tasks"
          value={tasks.length}
          subtext="Across your workspace"
        />
        <StatCard
          label="Pending"
          value={pendingTasks.length}
          subtext="Ready to work on"
        />
        <StatCard
          label="Completed"
          value={completedTasks.length}
          subtext="Tasks finished"
        />
        <StatCard
          label="On hold"
          value={tasks.filter((t) => t.held).length}
          subtext="Temporarily paused"
        />
      </section>

      <section className="panel task-panel">
        <div className="panel-header task-panel-header">
          <div>
            <h2>Your tasks</h2>
            <p>Keep track of everything that matters.</p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <div className="task-search">
              <Search size={16} />
              <input
                placeholder="Search tasks..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ArrowUpDown size={15} style={{ color: "var(--text-muted)" }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: "var(--surface)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
                aria-label="Sort tasks by"
              >
                {sortOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    Sort: {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="filter-row">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              className={`filter-chip ${taskFilter === filter ? "selected" : ""}`}
              onClick={() => setTaskFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="task-list">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleOpenEdit}
                onDeleteRequest={(t) => setTaskToDelete(t)}
              />
            ))
          ) : (
            <EmptyState
              icon={CheckSquare}
              title="No tasks found"
              message="Try another filter or create a new task."
              actionText="Create task"
              onAction={handleOpenCreate}
            />
          )}
        </div>
      </section>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTask}
      />

      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete Task"
        onConfirm={() => {
          if (taskToDelete) deleteTask(taskToDelete.id);
        }}
        onCancel={() => setTaskToDelete(null)}
      />
    </>
  );
}

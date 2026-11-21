import { useState } from "react";
import { Plus } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";
import { useHabits } from "../../hooks/useHabits";
import StatsGrid from "./components/StatsGrid";
import FocusMiniWidget from "./components/FocusMiniWidget";
import TaskCard from "../tasks/components/TaskCard";
import TaskModal from "../tasks/components/TaskModal";
import HabitRow from "../habits/components/HabitRow";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function OverviewView({ setActivePage }) {
  const { pendingTasks, addTask, updateTask, deleteTask } = useTasks();
  const { habits } = useHabits();

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

  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">YOUR PERSONAL WORKSPACE</span>
          <h1>
            Make today count<span className="brand-dot">.</span>
          </h1>
          <p>A little progress every day adds up to big results.</p>
        </div>
        <button className="primary-button" onClick={handleOpenCreate}>
          <Plus size={18} /> Add task
        </button>
      </section>

      <StatsGrid />

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Today's tasks</h2>
              <p>Your next steps.</p>
            </div>
            <button className="text-button" onClick={() => setActivePage("Tasks")}>
              View all →
            </button>
          </div>
          <div className="task-list">
            {pendingTasks.slice(0, 4).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleOpenEdit}
                onDeleteRequest={(t) => setTaskToDelete(t)}
              />
            ))}
            {pendingTasks.length === 0 && (
              <p className="muted">You're all caught up!</p>
            )}
          </div>
        </section>

        <FocusMiniWidget />

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Daily habits</h2>
              <p>Small wins matter.</p>
            </div>
            <button className="text-button" onClick={() => setActivePage("Habits")}>
              View all →
            </button>
          </div>
          <div>
            {habits.slice(0, 4).map((habit) => (
              <HabitRow key={habit.id} habit={habit} />
            ))}
          </div>
        </section>
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTask}
      />

      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
        confirmText="Delete Task"
        onConfirm={() => {
          if (taskToDelete) deleteTask(taskToDelete.id);
        }}
        onCancel={() => setTaskToDelete(null)}
      />
    </>
  );
}

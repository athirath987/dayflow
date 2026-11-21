import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { useHabits } from "../../hooks/useHabits";
import HabitRow from "./components/HabitRow";
import HabitModal from "./components/HabitModal";
import StatCard from "../../components/common/StatCard";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";

export default function HabitsView() {
  const {
    habits,
    completedTodayCount,
    totalHabitsCount,
    addHabit,
    updateHabit,
    deleteHabit
  } = useHabits();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [habitToDelete, setHabitToDelete] = useState(null);

  const handleOpenAdd = () => {
    setEditingHabit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (habit) => {
    setEditingHabit(habit);
    setModalOpen(true);
  };

  const handleSave = (name) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, name);
    } else {
      addHabit(name);
    }
  };

  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">CONSISTENCY BUILDS RESULTS</span>
          <h1>
            Daily habits<span className="brand-dot">.</span>
          </h1>
          <p>Show up for yourself every single day.</p>
        </div>
        <button className="primary-button" onClick={handleOpenAdd}>
          <Plus size={18} /> Add habit
        </button>
      </section>

      <section className="stats-grid">
        <StatCard
          label="Habits active"
          value={totalHabitsCount}
          subtext="Tracked daily"
        />
        <StatCard
          label="Completed today"
          value={`${completedTodayCount}/${totalHabitsCount}`}
          subtext="Today's consistency"
        />
        <StatCard
          label="Completion rate"
          value={`${totalHabitsCount > 0 ? Math.round((completedTodayCount / totalHabitsCount) * 100) : 0}%`}
          subtext="Today's completion"
        />
      </section>

      <section className="panel" style={{ marginTop: "20px" }}>
        <div className="panel-header">
          <div>
            <h2>Today's habits</h2>
            <p>
              {completedTodayCount} of {totalHabitsCount} completed
            </p>
          </div>
        </div>

        <div>
          {habits.length > 0 ? (
            habits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                onEdit={handleOpenEdit}
                onDeleteRequest={(h) => setHabitToDelete(h)}
              />
            ))
          ) : (
            <EmptyState
              icon={Target}
              title="No habits yet"
              message="Add your first daily habit to start building streaks."
              actionText="Add habit"
              onAction={handleOpenAdd}
            />
          )}
        </div>
      </section>

      <HabitModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingHabit}
      />

      <ConfirmDialog
        isOpen={Boolean(habitToDelete)}
        title="Delete Habit"
        message={`Are you sure you want to delete the habit "${habitToDelete?.name}"? Its streak history will be removed.`}
        confirmText="Delete Habit"
        onConfirm={() => {
          if (habitToDelete) deleteHabit(habitToDelete.id);
        }}
        onCancel={() => setHabitToDelete(null)}
      />
    </>
  );
}

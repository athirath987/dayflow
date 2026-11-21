import { useState } from "react";
import Modal from "../../../components/common/Modal";

function HabitFormContent({ initialData, onSave, onClose }) {
  const [name, setName] = useState(initialData?.name || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Habit name *</label>
      <input
        required
        autoFocus
        placeholder="e.g. Read 15 pages, Drink water, Gym"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="modal-actions">
        <button type="button" className="secondary-button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="primary-button">
          {initialData ? "Save changes" : "Create habit"}
        </button>
      </div>
    </form>
  );
}

export default function HabitModal({ isOpen, onClose, onSave, initialData }) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="DAILY HABIT"
      title={initialData ? "Edit habit" : "Create a new habit"}
    >
      <HabitFormContent
        key={initialData ? String(initialData.id) : "new"}
        initialData={initialData}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
}

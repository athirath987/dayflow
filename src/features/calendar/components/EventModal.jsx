import { useState } from "react";
import Modal from "../../../components/common/Modal";

function EventFormContent({ initialData, selectedDate, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    date: initialData?.date || selectedDate,
    time: initialData?.time || "",
    description: initialData?.description || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Event title *</label>
      <input
        required
        autoFocus
        placeholder="What is happening?"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <label>Date</label>
      <input
        type="date"
        required
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      />

      <label>Time (optional)</label>
      <input
        type="time"
        value={formData.time}
        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
      />

      <label>Description (optional)</label>
      <textarea
        rows={3}
        placeholder="Add event details..."
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      <div className="modal-actions">
        <button type="button" className="secondary-button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="primary-button">
          {initialData ? "Save changes" : "Create event"}
        </button>
      </div>
    </form>
  );
}

export default function EventModal({ isOpen, onClose, onSave, selectedDate, initialData }) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="YOUR SCHEDULE"
      title={initialData ? "Edit event" : "Create an event"}
    >
      <EventFormContent
        key={initialData ? String(initialData.id) : `new-${selectedDate}`}
        initialData={initialData}
        selectedDate={selectedDate}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
}

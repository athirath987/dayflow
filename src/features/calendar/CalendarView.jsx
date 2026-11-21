import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { useEvents } from "../../hooks/useEvents";
import CalendarGrid from "./components/CalendarGrid";
import AgendaPanel from "./components/AgendaPanel";
import EventModal from "./components/EventModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function CalendarView() {
  const { selectedDate, addEvent, updateEvent, deleteEvent } = useEvents();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  const handleOpenNewEvent = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleOpenEditEvent = (event) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleSaveEvent = (formData) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
    } else {
      addEvent(formData);
    }
  };

  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">PLAN YOUR TIME</span>
          <h1>
            Your calendar<span className="brand-dot">.</span>
          </h1>
          <p>Tasks, events and important dates in one place.</p>
        </div>
        <button className="primary-button" onClick={handleOpenNewEvent}>
          <CalendarPlus size={18} /> Add event
        </button>
      </section>

      <div className="calendar-layout">
        <CalendarGrid />
        <AgendaPanel
          onOpenNewEvent={handleOpenNewEvent}
          onOpenEditEvent={handleOpenEditEvent}
          onDeleteEventRequest={(event) => setEventToDelete(event)}
        />
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        initialData={editingEvent}
      />

      <ConfirmDialog
        isOpen={Boolean(eventToDelete)}
        title="Delete Event"
        message={`Are you sure you want to delete "${eventToDelete?.title}"?`}
        confirmText="Delete Event"
        onConfirm={() => {
          if (eventToDelete) deleteEvent(eventToDelete.id);
        }}
        onCancel={() => setEventToDelete(null)}
      />
    </>
  );
}

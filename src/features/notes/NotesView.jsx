import { useState, useEffect } from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { readStorage, writeStorage } from "../../services/db";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const defaultNotes = [
  {
    id: 1,
    title: "Quick thoughts",
    content: "DayFlow workspace idea: keep everything frictionless, local-first, and distraction free.",
    updatedAt: new Date().toLocaleDateString()
  }
];

export default function NotesView() {
  const [notes, setNotes] = useState(() => readStorage("dayflow-notes", defaultNotes));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [noteToDelete, setNoteToDelete] = useState(null);

  useEffect(() => {
    writeStorage("dayflow-notes", notes);
  }, [notes]);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setFormData({ title: "", content: "" });
    setModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? { ...n, ...formData, updatedAt: new Date().toLocaleDateString() }
            : n
        )
      );
    } else {
      setNotes((prev) => [
        {
          id: Date.now(),
          ...formData,
          updatedAt: new Date().toLocaleDateString()
        },
        ...prev
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">CAPTURE THOUGHTS</span>
          <h1>
            Notes & Ideas<span className="brand-dot">.</span>
          </h1>
          <p>Quick scratchpad for your thoughts, plans, and learnings.</p>
        </div>
        <button className="primary-button" onClick={handleOpenCreate}>
          <Plus size={18} /> New note
        </button>
      </section>

      {notes.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginTop: "24px" }}>
          {notes.map((note) => (
            <div
              key={note.id}
              className="panel"
              style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "180px", cursor: "pointer" }}
              onClick={() => handleOpenEdit(note)}
            >
              <div>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "17px", color: "var(--text)" }}>{note.title}</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                  {note.content}
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                <small style={{ color: "var(--text-muted)", fontSize: "12px" }}>{note.updatedAt}</small>
                <button
                  className="icon-button"
                  style={{ width: "28px", height: "28px" }}
                  title="Delete note"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNoteToDelete(note);
                  }}
                  aria-label="Delete note"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No notes yet"
          message="Jot down quick reminders, meeting notes, or ideas."
          actionText="Create note"
          onAction={handleOpenCreate}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        eyebrow="NOTEBOOK"
        title={editingNote ? "Edit note" : "New note"}
      >
        <form onSubmit={handleSave}>
          <label>Title *</label>
          <input
            required
            autoFocus
            placeholder="Note title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <label>Content</label>
          <textarea
            rows={5}
            placeholder="Write your note here..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              {editingNote ? "Save changes" : "Create note"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(noteToDelete)}
        title="Delete Note"
        message={`Are you sure you want to delete "${noteToDelete?.title}"?`}
        confirmText="Delete Note"
        onConfirm={() => {
          if (noteToDelete) handleDelete(noteToDelete.id);
        }}
        onCancel={() => setNoteToDelete(null)}
      />
    </>
  );
}

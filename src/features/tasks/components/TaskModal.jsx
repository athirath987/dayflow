import { useState } from "react";
import { Plus, X, ListTodo } from "lucide-react";
import Modal from "../../../components/common/Modal";

function TaskFormContent({ initialData, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "Medium",
    dueDate: initialData?.dueDate || ""
  });

  const [subtasks, setSubtasks] = useState(() => initialData?.subtasks || []);
  const [newSubtaskText, setNewSubtaskText] = useState("");

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: Date.now(), text: newSubtaskText.trim(), completed: false }
    ]);
    setNewSubtaskText("");
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave({ ...formData, subtasks });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Task title *</label>
      <input
        required
        autoFocus
        placeholder="What do you need to do?"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <label>Description</label>
      <textarea
        rows={3}
        placeholder="Add a little detail..."
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label>Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label>Due date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
      </div>

      <div style={{ marginTop: "14px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ListTodo size={14} /> Subtasks / Checklist
        </label>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <input
            placeholder="Add a subtask step..."
            value={newSubtaskText}
            onChange={(e) => setNewSubtaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSubtask();
              }
            }}
          />
          <button
            type="button"
            className="secondary-button"
            style={{ padding: "0 14px", flexShrink: 0 }}
            onClick={handleAddSubtask}
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {subtasks.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px", maxHeight: "140px", overflowY: "auto" }}>
            {subtasks.map((st) => (
              <div
                key={st.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 10px",
                  background: "var(--surface)",
                  borderRadius: "6px",
                  fontSize: "13px"
                }}
              >
                <span>{st.text}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(st.id)}
                  style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "2px" }}
                  aria-label="Remove subtask"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="modal-actions">
        <button type="button" className="secondary-button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="primary-button">
          {initialData ? "Save changes" : "Create task"}
        </button>
      </div>
    </form>
  );
}

export default function TaskModal({ isOpen, onClose, onSave, initialData }) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow={initialData ? "UPDATE YOUR WORK" : "MAKE IT HAPPEN"}
      title={initialData ? "Edit task" : "Create a task"}
    >
      <TaskFormContent
        key={initialData ? String(initialData.id) : "new"}
        initialData={initialData}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
}

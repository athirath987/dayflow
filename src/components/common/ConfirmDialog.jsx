import Modal from "./Modal";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = true
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} eyebrow="CONFIRMATION">
      <div style={{ marginTop: "12px", marginBottom: "24px", color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
        {message}
      </div>
      <div className="modal-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          {cancelText}
        </button>
        <button
          type="button"
          className="primary-button"
          style={isDestructive ? { background: "#ff4d6d", borderColor: "#ff4d6d" } : undefined}
          onClick={() => {
            onConfirm();
            onCancel();
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

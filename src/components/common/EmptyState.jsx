import { Plus } from "lucide-react";

export default function EmptyState({ icon: Icon, title, message, actionText, onAction }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={32} />}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionText && onAction && (
        <button className="primary-button" onClick={onAction}>
          <Plus size={16} /> {actionText}
        </button>
      )}
    </div>
  );
}

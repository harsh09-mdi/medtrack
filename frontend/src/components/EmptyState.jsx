import React from "react";

export default function EmptyState({ icon: Icon, title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-icon">
          <Icon size={28} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && (
        <button className="btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

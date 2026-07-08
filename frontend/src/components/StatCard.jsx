import React from "react";

export default function StatCard({ icon: Icon, label, value, gradient }) {
  return (
    <div className="stat-card" style={{ "--card-gradient": gradient }}>
      <div className="stat-icon">
        <Icon size={22} />
      </div>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

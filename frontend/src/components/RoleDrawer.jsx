import React from "react";
import { UserRound, Stethoscope, ArrowRight } from "lucide-react";

export default function RoleDrawer({ onSelect, heading, subheading }) {
  return (
    <div className="role-drawer">
      <div className="role-drawer-card">
        <h2>{heading}</h2>
        <p>{subheading}</p>

        <button type="button" className="role-option role-option-patient" onClick={() => onSelect("patient")}>
          <span className="role-option-icon">
            <UserRound size={20} />
          </span>
          <span className="role-option-text">
            <span className="role-option-title">Patient</span>
            <span className="role-option-sub">View your records, prescriptions & doctor checkups</span>
          </span>
          <ArrowRight size={16} />
        </button>

        <button type="button" className="role-option role-option-doctor" onClick={() => onSelect("doctor")}>
          <span className="role-option-icon">
            <Stethoscope size={20} />
          </span>
          <span className="role-option-text">
            <span className="role-option-title">Doctor</span>
            <span className="role-option-sub">Search a patient & add checkup records</span>
          </span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

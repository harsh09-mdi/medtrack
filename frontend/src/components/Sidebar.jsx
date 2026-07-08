import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileHeart,
  Pill,
  Stethoscope,
  UserCircle2,
  Activity,
  ClipboardPlus,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const patientLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/records", label: "Health Records", icon: FileHeart },
  { to: "/prescriptions", label: "Prescriptions", icon: Pill },
  { to: "/visits", label: "Doctor Visits", icon: Stethoscope },
  { to: "/doctor-checkups", label: "Doctor Checkups", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

const doctorLinks = [
  { to: "/doctor", label: "Patient Checkups", icon: ClipboardPlus, end: true },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === "doctor" ? doctorLinks : patientLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-badge">
          <Activity size={20} strokeWidth={2.5} />
        </span>
        <div>
          <p className="brand-title">MedTrack</p>
          <p className="brand-subtitle">{user?.role === "doctor" ? "Doctor Portal" : "Health Record Tracker"}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="pulse-line">
          <svg viewBox="0 0 200 40" preserveAspectRatio="none">
            <polyline
              points="0,20 30,20 40,5 50,35 60,20 90,20 100,10 110,30 120,20 200,20"
              fill="none"
              stroke="url(#pulseGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="pulseGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00E5C7" />
                <stop offset="100%" stopColor="#FF6B9D" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p className="sidebar-note">
          {user?.role === "doctor" ? "Search, diagnose, done." : "Your records, always in sync."}
        </p>
      </div>
    </aside>
  );
}

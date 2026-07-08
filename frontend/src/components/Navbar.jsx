import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ title, subtitle }) {
  const { user, logout } = useAuth();

  const initials = (user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
      </div>

      <div className="topbar-user">
        <div className="avatar">{initials}</div>
        <div className="topbar-user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-email">{user?.email}</p>
        </div>
        <button className="icon-btn" onClick={logout} title="Log out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="full-loader">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === "doctor" ? "/doctor" : "/"} replace />;
  }

  return children;
}

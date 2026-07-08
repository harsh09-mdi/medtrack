import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import Prescriptions from "./pages/Prescriptions";
import Visits from "./pages/Visits";
import PatientCheckups from "./pages/PatientCheckups";
import Profile from "./pages/Profile";
import DoctorDashboard from "./pages/DoctorDashboard";

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient-only routes */}
      <Route
        path="/"
        element={
          <RoleRoute role="patient">
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </RoleRoute>
        }
      />
      <Route
        path="/records"
        element={
          <RoleRoute role="patient">
            <AppLayout>
              <Records />
            </AppLayout>
          </RoleRoute>
        }
      />
      <Route
        path="/prescriptions"
        element={
          <RoleRoute role="patient">
            <AppLayout>
              <Prescriptions />
            </AppLayout>
          </RoleRoute>
        }
      />
      <Route
        path="/visits"
        element={
          <RoleRoute role="patient">
            <AppLayout>
              <Visits />
            </AppLayout>
          </RoleRoute>
        }
      />
      <Route
        path="/doctor-checkups"
        element={
          <RoleRoute role="patient">
            <AppLayout>
              <PatientCheckups />
            </AppLayout>
          </RoleRoute>
        }
      />

      {/* Doctor-only route */}
      <Route
        path="/doctor"
        element={
          <RoleRoute role="doctor">
            <AppLayout>
              <DoctorDashboard />
            </AppLayout>
          </RoleRoute>
        }
      />

      {/* Shared route — available to both roles */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Login />} />
    </Routes>
  );
}

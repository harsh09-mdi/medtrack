import React, { useState } from "react";
import { Save } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const isDoctor = user?.role === "doctor";

  const [form, setForm] = useState({
    name: user?.name || "",
    age: user?.age || "",
    bloodGroup: user?.bloodGroup || "",
    phone: user?.phone || "",
    specialization: user?.specialization || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await api.put("/auth/me", form);
      updateUser(res.data.user);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile.");
    }
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <Navbar title="Your Profile" subtitle="Manage your personal and contact information." />

      <div className="page-body">
        <div className="profile-layout">
          <div className="card profile-summary">
            <div className="avatar avatar-lg">{initials}</div>
            <h3>{user?.name}</h3>
            <p className="muted">{user?.email}</p>

            {!isDoctor && user?.patientCode && (
              <div className="profile-code-pill">Patient ID: {user.patientCode}</div>
            )}
            {isDoctor && user?.doctorCode && (
              <div className="profile-code-pill profile-code-pill-doctor">Doctor ID: {user.doctorCode}</div>
            )}

            <div className="profile-meta">
              {isDoctor ? (
                <>
                  <div>
                    <p className="mini-sub">Specialization</p>
                    <p className="mini-title">{user?.specialization || "—"}</p>
                  </div>
                  <div>
                    <p className="mini-sub">Phone</p>
                    <p className="mini-title">{user?.phone || "—"}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="mini-sub">Age</p>
                    <p className="mini-title">{user?.age || "—"}</p>
                  </div>
                  <div>
                    <p className="mini-sub">Blood Group</p>
                    <p className="mini-title">{user?.bloodGroup || "—"}</p>
                  </div>
                  <div>
                    <p className="mini-sub">Phone</p>
                    <p className="mini-title">{user?.phone || "—"}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card profile-form">
            <h3>Edit Details</h3>
            {message && <div className="alert-success">{message}</div>}
            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <label className="field">
                <span>Full name</span>
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>

              {isDoctor ? (
                <label className="field">
                  <span>Specialization</span>
                  <input name="specialization" value={form.specialization} onChange={handleChange} />
                </label>
              ) : (
                <div className="field-row">
                  <label className="field">
                    <span>Age</span>
                    <input type="number" name="age" min="0" value={form.age} onChange={handleChange} />
                  </label>
                  <label className="field">
                    <span>Blood group</span>
                    <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                      <option value="">Select</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              <label className="field">
                <span>Phone number</span>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. +91 98765 43210" />
              </label>

              <button className="btn-primary" type="submit">
                <Save size={16} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

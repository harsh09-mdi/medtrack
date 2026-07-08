import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  UserRound,
  Stethoscope,
  KeyRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import RoleDrawer from "../components/RoleDrawer";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  age: "",
  bloodGroup: "",
  phone: "",
  specialization: "",
  accessCode: "",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const registeredUser = await register({ ...form, role: selectedRole });
      navigate(registeredUser.role === "doctor" ? "/doctor" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-visual">
        <div className="auth-visual-badge">
          <Activity size={26} strokeWidth={2.5} />
        </div>
        <h2>MedTrack</h2>
        <p>Create your free account and bring every medical record into one place.</p>
        <div className="auth-visual-pulse">
          <svg viewBox="0 0 300 60" preserveAspectRatio="none">
            <polyline
              points="0,30 50,30 65,10 80,50 95,30 140,30 155,15 170,45 185,30 300,30"
              fill="none"
              stroke="url(#regPulse)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="regPulse" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00E5C7" />
                <stop offset="50%" stopColor="#6C63FF" />
                <stop offset="100%" stopColor="#FF6B9D" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="auth-form-panel">
        {!selectedRole ? (
          <RoleDrawer
            heading="Join MedTrack"
            subheading="Tell us who you are to get started."
            onSelect={(role) => setSelectedRole(role)}
          />
        ) : (
          <div className="auth-card">
            <button type="button" className="role-back" onClick={() => setSelectedRole(null)}>
              <ArrowLeft size={15} /> Change account type
            </button>

            <div className="role-badge">
              {selectedRole === "doctor" ? <Stethoscope size={15} /> : <UserRound size={15} />}
              {selectedRole === "doctor" ? "Doctor Registration" : "Patient Registration"}
            </div>

            <h1>Create your account</h1>
            <p className="auth-subtitle">It takes less than a minute.</p>

            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <label className="field">
                <span>Full name</span>
                <div className="input-with-icon">
                  <User size={17} />
                  <input
                    type="text"
                    name="name"
                    placeholder={selectedRole === "doctor" ? "Dr. Rakesh Gupta" : "Aditi Sharma"}
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              <label className="field">
                <span>Email</span>
                <div className="input-with-icon">
                  <Mail size={17} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              <label className="field">
                <span>Password</span>
                <div className="input-with-icon">
                  <Lock size={17} />
                  <input
                    type="password"
                    name="password"
                    placeholder="At least 6 characters"
                    minLength={6}
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              {selectedRole === "patient" && (
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

              {selectedRole === "doctor" && (
                <>
                  <label className="field">
                    <span>Specialization</span>
                    <input
                      name="specialization"
                      value={form.specialization}
                      onChange={handleChange}
                      placeholder="e.g. General Physician, Cardiologist"
                    />
                  </label>

                  <label className="field">
                    <span>Doctor access code</span>
                    <div className="input-with-icon">
                      <KeyRound size={17} />
                      <input
                        name="accessCode"
                        value={form.accessCode}
                        onChange={handleChange}
                        placeholder="Enter the code shared by your admin"
                        required
                      />
                    </div>
                  </label>
                </>
              )}

              <label className="field">
                <span>Phone number</span>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. +91 98765 43210" />
              </label>

              <button className="btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
                <ArrowRight size={17} />
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

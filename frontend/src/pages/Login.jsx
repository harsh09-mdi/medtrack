import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Mail, Lock, ArrowRight, ArrowLeft, UserRound, Stethoscope } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import RoleDrawer from "../components/RoleDrawer";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(form.email, form.password);
      navigate(loggedInUser.role === "doctor" ? "/doctor" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in. Please try again.");
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
        <p>Every prescription, report, and visit — organized in one calm, colourful place.</p>
        <div className="auth-visual-pulse">
          <svg viewBox="0 0 300 60" preserveAspectRatio="none">
            <polyline
              points="0,30 50,30 65,10 80,50 95,30 140,30 155,15 170,45 185,30 300,30"
              fill="none"
              stroke="url(#loginPulse)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="loginPulse" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFD166" />
                <stop offset="50%" stopColor="#FF6B9D" />
                <stop offset="100%" stopColor="#00E5C7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="auth-form-panel">
        {!selectedRole ? (
          <RoleDrawer
            heading="Welcome to MedTrack"
            subheading="Choose how you'd like to log in."
            onSelect={setSelectedRole}
          />
        ) : (
          <div className="auth-card">
            <button type="button" className="role-back" onClick={() => setSelectedRole(null)}>
              <ArrowLeft size={15} /> Change login type
            </button>

            <div className="role-badge">
              {selectedRole === "doctor" ? <Stethoscope size={15} /> : <UserRound size={15} />}
              {selectedRole === "doctor" ? "Doctor Login" : "Patient Login"}
            </div>

            <h1>Welcome back</h1>
            <p className="auth-subtitle">Log in to view your health dashboard.</p>

            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
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
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              <button className="btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
                <ArrowRight size={17} />
              </button>
            </form>

            <p className="auth-switch">
              New to MedTrack? <Link to="/register">Create an account</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

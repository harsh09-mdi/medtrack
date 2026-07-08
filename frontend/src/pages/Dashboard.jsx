import React, { useEffect, useState } from "react";
import { FileHeart, Pill, Stethoscope, ClipboardList, Copy, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [visits, setVisits] = useState([]);
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/records"),
      api.get("/prescriptions"),
      api.get("/visits"),
      api.get("/checkups"),
    ])
      .then(([r, p, v, c]) => {
        setRecords(r.data.records);
        setPrescriptions(p.data.prescriptions);
        setVisits(v.data.visits);
        setCheckups(c.data.checkups);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    if (!user?.patientCode) return;
    navigator.clipboard.writeText(user.patientCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <Navbar
        title={`Hi, ${user?.name?.split(" ")[0] || "there"} 👋`}
        subtitle="Here's a quick look at your health records today."
      />

      <div className="page-body">
        {user?.patientCode && (
          <div className="patient-id-banner">
            <div>
              <p className="patient-id-label">Your Patient ID</p>
              <p className="patient-id-value">{user.patientCode}</p>
              <p className="patient-id-hint">Share this ID with your doctor during a checkup so they can add your diagnosis here.</p>
            </div>
            <button className="icon-btn" onClick={handleCopy} title="Copy Patient ID">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}

        <div className="stat-grid">
          <StatCard
            icon={FileHeart}
            label="Health Records"
            value={records.length}
            gradient="linear-gradient(135deg, #6C63FF, #A78BFA)"
          />
          <StatCard
            icon={Pill}
            label="Prescriptions"
            value={prescriptions.length}
            gradient="linear-gradient(135deg, #00C9A7, #00E5C7)"
          />
          <StatCard
            icon={Stethoscope}
            label="Doctor Visits"
            value={visits.length}
            gradient="linear-gradient(135deg, #FF6B9D, #FF9BC1)"
          />
          <StatCard
            icon={ClipboardList}
            label="Doctor Checkups"
            value={checkups.length}
            gradient="linear-gradient(135deg, #FFC75F, #FFD98E)"
          />
        </div>

        <div className="dashboard-grid">
          <section className="card">
            <div className="card-header">
              <h3>Recent Health Records</h3>
            </div>
            {loading ? (
              <p className="muted">Loading...</p>
            ) : records.length === 0 ? (
              <EmptyState
                icon={FileHeart}
                title="No records yet"
                message="Add your first medical record to get started."
              />
            ) : (
              <ul className="mini-list">
                {records.slice(0, 5).map((r) => (
                  <li key={r.id}>
                    <span className="dot dot-purple" />
                    <div>
                      <p className="mini-title">{r.title}</p>
                      <p className="mini-sub">
                        {r.type} • {new Date(r.date).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h3>Recent Prescriptions</h3>
            </div>
            {loading ? (
              <p className="muted">Loading...</p>
            ) : prescriptions.length === 0 ? (
              <EmptyState
                icon={Pill}
                title="No prescriptions yet"
                message="Track medicines and dosages here."
              />
            ) : (
              <ul className="mini-list">
                {prescriptions.slice(0, 5).map((p) => (
                  <li key={p.id}>
                    <span className="dot dot-teal" />
                    <div>
                      <p className="mini-title">{p.medicineName}</p>
                      <p className="mini-sub">
                        {p.dosage} • {p.frequency || "as advised"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h3>Recent Doctor Checkups</h3>
            </div>
            {loading ? (
              <p className="muted">Loading...</p>
            ) : checkups.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No checkups yet"
                message="Your doctor's checkup notes will appear here."
              />
            ) : (
              <ul className="mini-list">
                {checkups.slice(0, 5).map((c) => (
                  <li key={c.id}>
                    <span className="dot dot-pink" />
                    <div>
                      <p className="mini-title">{c.diagnosis}</p>
                      <p className="mini-sub">
                        Dr. {c.doctorName} • {new Date(c.date).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

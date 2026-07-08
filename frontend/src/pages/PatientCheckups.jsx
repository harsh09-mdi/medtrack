import React, { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import Navbar from "../components/Navbar";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";

export default function PatientCheckups() {
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/checkups")
      .then((res) => setCheckups(res.data.checkups))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar
        title="Doctor Checkups"
        subtitle="Diagnoses and checkup notes added by your doctors. View only — your doctor keeps this updated."
      />

      <div className="page-body">
        {loading ? (
          <p className="muted">Loading...</p>
        ) : checkups.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No checkups yet"
            message="Once a doctor adds a checkup using your Patient ID, it will show up here."
          />
        ) : (
          <div className="timeline">
            {checkups.map((c) => (
              <div key={c.id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <div className="record-card-top">
                    <span className="record-date">{new Date(c.date).toLocaleDateString()}</span>
                    {c.followUpDate && (
                      <span className="badge badge-followup">
                        Follow-up: {new Date(c.followUpDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h4>{c.diagnosis}</h4>
                  <p className="muted-small">Checked by Dr. {c.doctorName}</p>
                  {c.symptoms && (
                    <p className="record-desc">
                      <strong>Symptoms:</strong> {c.symptoms}
                    </p>
                  )}
                  {c.vitals && (
                    <p className="record-desc">
                      <strong>Vitals:</strong> {c.vitals}
                    </p>
                  )}
                  {c.notes && <p className="record-desc">{c.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

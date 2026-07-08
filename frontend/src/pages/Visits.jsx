import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Stethoscope } from "lucide-react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";

const emptyForm = {
  doctorName: "",
  hospital: "",
  date: "",
  diagnosis: "",
  followUpDate: "",
  notes: "",
};

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const fetchVisits = () => {
    setLoading(true);
    api
      .get("/visits")
      .then((res) => setVisits(res.data.visits))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (v) => {
    setEditingId(v.id);
    setForm({
      doctorName: v.doctorName,
      hospital: v.hospital,
      date: v.date?.slice(0, 10),
      diagnosis: v.diagnosis,
      followUpDate: v.followUpDate ? v.followUpDate.slice(0, 10) : "",
      notes: v.notes,
    });
    setError("");
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/visits/${editingId}`, form);
      } else {
        await api.post("/visits", form);
      }
      setShowModal(false);
      fetchVisits();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this visit record?")) return;
    await api.delete(`/visits/${id}`);
    fetchVisits();
  };

  return (
    <>
      <Navbar title="Doctor Visits" subtitle="Consultations, diagnoses and follow-ups at a glance." />

      <div className="page-body">
        <div className="toolbar toolbar-end">
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={17} /> Add Visit
          </button>
        </div>

        {loading ? (
          <p className="muted">Loading visits...</p>
        ) : visits.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="No visits logged yet"
            message="Add a doctor visit to keep a record of your consultations."
            actionLabel="Add Visit"
            onAction={openAddModal}
          />
        ) : (
          <div className="timeline">
            {visits.map((v) => (
              <div key={v.id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <div className="record-card-top">
                    <span className="record-date">{new Date(v.date).toLocaleDateString()}</span>
                    {v.followUpDate && (
                      <span className="badge badge-followup">
                        Follow-up: {new Date(v.followUpDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h4>Dr. {v.doctorName}</h4>
                  {v.hospital && <p className="muted-small">{v.hospital}</p>}
                  {v.diagnosis && (
                    <p className="record-desc">
                      <strong>Diagnosis:</strong> {v.diagnosis}
                    </p>
                  )}
                  {v.notes && <p className="record-desc">{v.notes}</p>}
                  <div className="record-actions">
                    <button className="icon-btn" onClick={() => openEditModal(v)}>
                      <Pencil size={16} />
                    </button>
                    <button className="icon-btn icon-btn-danger" onClick={() => handleDelete(v.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editingId ? "Edit Visit" : "Add Doctor Visit"} onClose={() => setShowModal(false)}>
          {error && <div className="alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <label className="field">
                <span>Doctor name</span>
                <input
                  name="doctorName"
                  value={form.doctorName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rakesh Gupta"
                />
              </label>
              <label className="field">
                <span>Hospital / Clinic</span>
                <input name="hospital" value={form.hospital} onChange={handleChange} placeholder="e.g. City Hospital" />
              </label>
            </div>

            <div className="field-row">
              <label className="field">
                <span>Visit date</span>
                <input type="date" name="date" value={form.date} onChange={handleChange} required />
              </label>
              <label className="field">
                <span>Follow-up date (optional)</span>
                <input type="date" name="followUpDate" value={form.followUpDate} onChange={handleChange} />
              </label>
            </div>

            <label className="field">
              <span>Diagnosis</span>
              <input
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                placeholder="e.g. Seasonal flu"
              />
            </label>

            <label className="field">
              <span>Notes</span>
              <textarea
                name="notes"
                rows={2}
                value={form.notes}
                onChange={handleChange}
                placeholder="Any additional details from the visit"
              />
            </label>

            <button className="btn-primary btn-block" type="submit">
              {editingId ? "Save Changes" : "Add Visit"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

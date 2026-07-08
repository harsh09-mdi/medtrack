import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Pill } from "lucide-react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";

const emptyForm = {
  medicineName: "",
  dosage: "",
  frequency: "",
  startDate: "",
  endDate: "",
  doctorName: "",
  notes: "",
};

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const fetchPrescriptions = () => {
    setLoading(true);
    api
      .get("/prescriptions")
      .then((res) => setPrescriptions(res.data.prescriptions))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setForm({
      medicineName: p.medicineName,
      dosage: p.dosage,
      frequency: p.frequency,
      startDate: p.startDate?.slice(0, 10),
      endDate: p.endDate ? p.endDate.slice(0, 10) : "",
      doctorName: p.doctorName,
      notes: p.notes,
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
        await api.put(`/prescriptions/${editingId}`, form);
      } else {
        await api.post("/prescriptions", form);
      }
      setShowModal(false);
      fetchPrescriptions();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prescription?")) return;
    await api.delete(`/prescriptions/${id}`);
    fetchPrescriptions();
  };

  const isActive = (p) => !p.endDate || new Date(p.endDate) >= new Date();

  return (
    <>
      <Navbar title="Prescriptions" subtitle="Keep track of medicines, dosages and schedules." />

      <div className="page-body">
        <div className="toolbar toolbar-end">
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={17} /> Add Prescription
          </button>
        </div>

        {loading ? (
          <p className="muted">Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <EmptyState
            icon={Pill}
            title="No prescriptions yet"
            message="Add a prescription to start tracking your medicines."
            actionLabel="Add Prescription"
            onAction={openAddModal}
          />
        ) : (
          <div className="record-grid">
            {prescriptions.map((p) => (
              <div key={p.id} className="record-card record-card-teal">
                <div className="record-card-top">
                  <span className={`badge ${isActive(p) ? "badge-active" : "badge-ended"}`}>
                    {isActive(p) ? "Active" : "Completed"}
                  </span>
                  <span className="record-date">
                    {new Date(p.startDate).toLocaleDateString()}
                    {p.endDate ? ` – ${new Date(p.endDate).toLocaleDateString()}` : ""}
                  </span>
                </div>
                <h4>{p.medicineName}</h4>
                <p className="record-desc">
                  <strong>{p.dosage}</strong> {p.frequency && `• ${p.frequency}`}
                </p>
                {p.doctorName && <p className="record-desc muted-small">Prescribed by Dr. {p.doctorName}</p>}
                {p.notes && <p className="record-desc">{p.notes}</p>}
                <div className="record-actions">
                  <button className="icon-btn" onClick={() => openEditModal(p)}>
                    <Pencil size={16} />
                  </button>
                  <button className="icon-btn icon-btn-danger" onClick={() => handleDelete(p.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editingId ? "Edit Prescription" : "Add Prescription"} onClose={() => setShowModal(false)}>
          {error && <div className="alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label className="field">
              <span>Medicine name</span>
              <input
                name="medicineName"
                value={form.medicineName}
                onChange={handleChange}
                required
                placeholder="e.g. Paracetamol"
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span>Dosage</span>
                <input
                  name="dosage"
                  value={form.dosage}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 500mg"
                />
              </label>
              <label className="field">
                <span>Frequency</span>
                <input
                  name="frequency"
                  value={form.frequency}
                  onChange={handleChange}
                  placeholder="e.g. Twice a day"
                />
              </label>
            </div>

            <div className="field-row">
              <label className="field">
                <span>Start date</span>
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
              </label>
              <label className="field">
                <span>End date (optional)</span>
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
              </label>
            </div>

            <label className="field">
              <span>Prescribing doctor</span>
              <input name="doctorName" value={form.doctorName} onChange={handleChange} placeholder="e.g. Dr. Verma" />
            </label>

            <label className="field">
              <span>Notes</span>
              <textarea
                name="notes"
                rows={2}
                value={form.notes}
                onChange={handleChange}
                placeholder="Take after meals, avoid alcohol, etc."
              />
            </label>

            <button className="btn-primary btn-block" type="submit">
              {editingId ? "Save Changes" : "Add Prescription"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

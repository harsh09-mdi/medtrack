import React, { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, FileHeart } from "lucide-react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";

const RECORD_TYPES = ["General", "Lab Report", "Diagnosis", "Surgery", "Vaccination", "Allergy", "Other"];

const emptyForm = { title: "", type: "General", description: "", date: "" };

export default function Records() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const fetchRecords = (searchTerm = "") => {
    setLoading(true);
    api
      .get("/records", { params: searchTerm ? { search: searchTerm } : {} })
      .then((res) => setRecords(res.data.records))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => fetchRecords(search), 350);
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setEditingId(record.id);
    setForm({
      title: record.title,
      type: record.type,
      description: record.description,
      date: record.date?.slice(0, 10),
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
        await api.put(`/records/${editingId}`, form);
      } else {
        await api.post("/records", form);
      }
      setShowModal(false);
      fetchRecords(search);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;
    await api.delete(`/records/${id}`);
    fetchRecords(search);
  };

  return (
    <>
      <Navbar title="Health Records" subtitle="All your medical records in one organized place." />

      <div className="page-body">
        <div className="toolbar">
          <div className="search-box">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search records by title, type or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={17} /> Add Record
          </button>
        </div>

        {loading ? (
          <p className="muted">Loading records...</p>
        ) : records.length === 0 ? (
          <EmptyState
            icon={FileHeart}
            title="No records found"
            message="Start by adding your first health record."
            actionLabel="Add Record"
            onAction={openAddModal}
          />
        ) : (
          <div className="record-grid">
            {records.map((r) => (
              <div key={r.id} className="record-card">
                <div className="record-card-top">
                  <span className={`badge badge-${r.type.toLowerCase().replace(/\s/g, "-")}`}>{r.type}</span>
                  <span className="record-date">{new Date(r.date).toLocaleDateString()}</span>
                </div>
                <h4>{r.title}</h4>
                <p className="record-desc">{r.description || "No additional notes."}</p>
                <div className="record-actions">
                  <button className="icon-btn" onClick={() => openEditModal(r)}>
                    <Pencil size={16} />
                  </button>
                  <button className="icon-btn icon-btn-danger" onClick={() => handleDelete(r.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editingId ? "Edit Health Record" : "Add Health Record"} onClose={() => setShowModal(false)}>
          {error && <div className="alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label className="field">
              <span>Title</span>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Blood Test Report" />
            </label>

            <div className="field-row">
              <label className="field">
                <span>Type</span>
                <select name="type" value={form.type} onChange={handleChange}>
                  {RECORD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Date</span>
                <input type="date" name="date" value={form.date} onChange={handleChange} required />
              </label>
            </div>

            <label className="field">
              <span>Description</span>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Add any notes or details..."
              />
            </label>

            <button className="btn-primary btn-block" type="submit">
              {editingId ? "Save Changes" : "Add Record"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

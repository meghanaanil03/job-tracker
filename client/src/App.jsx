import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:4000";

export default function App() {
  const [jobs, setJobs] = useState([]);

  const [form, setForm] = useState({
    company: "",
    roleTitle: "",
    status: "Saved",
    location: "",
    link: "",
    notes: "",
    applied_date: "",
  });

  const [filterStatus, setFilterStatus] = useState("All");

  async function fetchJobs() {
    const res = await fetch(`${API}/jobs`);
    const data = await res.json();
    setJobs(data);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  async function addJob(e) {
    e.preventDefault();

    if (!form.company.trim() || !form.roleTitle.trim()) {
      alert("Company and Role Title are required");
      return;
    }

    const res = await fetch(`${API}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Failed to add job");
      return;
    }

    setForm({
      company: "",
      roleTitle: "",
      status: "Saved",
      location: "",
      link: "",
      notes: "",
      applied_date: "",
    });

    fetchJobs();
  }

  async function deleteJob(id) {
    const res = await fetch(`${API}/jobs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete job");
      return;
    }
    fetchJobs();
  }

  const filteredJobs =
    filterStatus === "All" ? jobs : jobs.filter((j) => j.status === filterStatus);

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="title">Job Tracker</h1>
          <p className="subtitle">
            Track applications across stages and keep everything in one place.
          </p>
        </div>
      </div>

      <div className="card">
        {/* Filter bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Showing <b style={{ color: "var(--text)" }}>{filteredJobs.length}</b>{" "}
            job(s)
          </div>

          <select
            className="select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ maxWidth: 220 }}
          >
            {["All", "Saved", "Applied", "Interview", "Offer", "Rejected"].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              )
            )}
          </select>
        </div>

        {/* Row 1: core fields */}
        <form onSubmit={addJob} className="formRow">
          <input
            className="input"
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />

          <input
            className="input"
            placeholder="Role Title"
            value={form.roleTitle}
            onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
          />

          <select
            className="select"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {["Saved", "Applied", "Interview", "Offer", "Rejected"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button className="btn" type="submit">
            Add Job
          </button>
        </form>

        {/* Row 2: extra fields */}
        <div
          className="formRow"
          style={{
            marginTop: 10,
            gridTemplateColumns: "1fr 1fr 1fr",
          }}
        >
          <input
            className="input"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <input
            className="input"
            placeholder="Job Link (https://...)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />

          <input
            type="date"
            className="input"
            value={form.applied_date}
            onChange={(e) => setForm({ ...form, applied_date: e.target.value })}
          />
        </div>

        <textarea
          className="input"
          placeholder="Notes..."
          rows="3"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          style={{ marginTop: 10 }}
        />

        {/* Results */}
        <div className="resultsArea">
          {filteredJobs.length === 0 ? (
            <div className="emptyState">No jobs match this filter.</div>
          ) : (
            <ul className="list">
              {filteredJobs.map((j) => (
                <li className="item" key={j.id}>
                  <div className="itemTitle">
                    <div className="company">
                      {j.link ? (
                        <a
                          href={j.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {j.company}
                        </a>
                      ) : (
                        j.company
                      )}{" "}
                      <span className={`badge ${j.status.toLowerCase()}`}>
                        {j.status}
                      </span>
                    </div>

                    <div className="meta">
                      {j.role_title}
                      {j.location ? ` • ${j.location}` : ""}
                      {j.applied_date
                        ? ` • Applied ${String(j.applied_date).slice(0, 10)}`
                        : ""}
                    </div>

                    {j.notes ? (
                      <div className="meta" style={{ marginTop: 6 }}>
                        {j.notes}
                      </div>
                    ) : null}
                  </div>

                  <div className="actions">
                    <button
                      className="btn btnDanger"
                      onClick={() => deleteJob(j.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

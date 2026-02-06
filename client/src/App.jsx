import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:4000";

export default function App() {
  const [jobs, setJobs] = useState([]);

  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [status, setStatus] = useState("Saved");

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

    if (!company.trim() || !roleTitle.trim()) {
      alert("Company and Role Title are required");
      return;
    }

    const res = await fetch(`${API}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, roleTitle, status }),
    });

    if (!res.ok) {
      alert("Failed to add job");
      return;
    }

    setCompany("");
    setRoleTitle("");
    setStatus("Saved");
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

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="title">Job Tracker</h1>
          <p className="subtitle">Track applications across stages and keep everything in one place.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={addJob} className="formRow">
          <input
            className="input"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <input
            className="input"
            placeholder="Role Title"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
          />

          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
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

        <ul className="list">
          {jobs.map((j) => (
            <li className="item" key={j.id}>
              <div className="itemTitle">
                <div className="company">
                  {j.company} <span className="badge">{j.status}</span>
                </div>
                <div className="meta">{j.role_title}</div>
              </div>

              <div className="actions">
                <button className="btn btnDanger" onClick={() => deleteJob(j.id)} type="button">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

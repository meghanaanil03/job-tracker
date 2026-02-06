import { useEffect, useState } from "react";

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

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Job Tracker</h1>

      <form onSubmit={addJob} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          placeholder="Role Title"
          value={roleTitle}
          onChange={(e) => setRoleTitle(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {["Saved", "Applied", "Interview", "Offer", "Rejected"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>

      <ul>
        {jobs.map((j) => (
          <li key={j.id}>
            {j.company} — {j.role_title} ({j.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

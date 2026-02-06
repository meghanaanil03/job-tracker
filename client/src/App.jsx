import { useEffect, useState } from "react";

const API = "http://localhost:4000";

export default function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API}/jobs`);
      const data = await res.json();
      setJobs(data);
    }
    load();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Job Tracker</h1>

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

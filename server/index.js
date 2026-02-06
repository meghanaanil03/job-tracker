const express = require("express");
const cors = require("cors");

const app = express();

require("dotenv").config();
const pool = require("./db");

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/jobs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.post("/jobs", async (req, res) => {
  try {
    const { company, roleTitle, status } = req.body;

    if (!company || !roleTitle) {
        return res.status(400).json({ error: "company and roleTitle are required" });
    }

    const result = await pool.query(
      "INSERT INTO jobs (company, role_title, status) VALUES ($1, $2, $3) RETURNING *",
      [company, roleTitle, status || "Saved"]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.delete("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM jobs WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ deleted: true, job: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.listen(4000, () => {
  console.log("API running on http://localhost:4000");
});

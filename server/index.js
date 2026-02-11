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
    const {
      company,
      roleTitle,
      status,
      location,
      link,
      notes,
      applied_date
      } = req.body;

    if (!company || !roleTitle) {
        return res.status(400).json({ error: "company and roleTitle are required" });
    }

    const result = await pool.query(
      `INSERT INTO jobs 
      (company, role_title, status, location, link, notes, applied_date) 
      VALUES ($1,$2,$3,$4,$5,$6,$7) 
      RETURNING *`,
      [
        company,
        roleTitle,
        status || "Saved",
        location || null,
        link || null,
        notes || null,
        applied_date || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.put("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company,
      roleTitle,
      status,
      location,
      link,
      notes,
      applied_date,
    } = req.body;

    const result = await pool.query(
      `UPDATE jobs
       SET company=$1,
           role_title=$2,
           status=$3,
           location=$4,
           link=$5,
           notes=$6,
           applied_date=$7
       WHERE id=$8
       RETURNING *`,
      [
        company,
        roleTitle,
        status,
        location,
        link,
        notes,
        applied_date,
        id,
      ]
    );

    res.json(result.rows[0]);
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

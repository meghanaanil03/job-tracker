const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/job", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

app.listen(4000, () => {
  console.log("API running on http://localhost:4000");
});

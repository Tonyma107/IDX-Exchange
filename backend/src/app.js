const express = require("express");
const cors = require("cors");
const healthRouter = require("./routes/health");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "IDX Exchange API" });
});

app.use("/api/health", healthRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;

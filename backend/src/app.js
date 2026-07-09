require("dotenv").config();

const express = require("express");
const cors = require("cors");
const healthRouter = require("./routes/health");
const propertiesRouter = require("./routes/properties");

const app = express();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
});

app.use("/api/health", healthRouter);
app.use("/api/properties", propertiesRouter);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

module.exports = app;
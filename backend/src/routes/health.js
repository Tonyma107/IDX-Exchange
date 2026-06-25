const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    await pool.query("SELECT 1");

    return res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error.code || error.message);

    return res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

module.exports = router;

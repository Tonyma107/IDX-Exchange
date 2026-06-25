require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const port = Number(process.env.PORT || 5000);

const server = app.listen(port, () => {
  console.log(`IDX Exchange API running at http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down...`);

  server.close(async () => {
    try {
      await pool.end();
    } finally {
      process.exit(0);
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

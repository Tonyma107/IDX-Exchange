const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

const app = require("../src/app");
const pool = require("../src/config/db");

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

  await pool.end();
});

test("minPrice and beds return the correct total", async () => {
  const minPrice = 300000;
  const beds = 3;

  const response = await fetch(
    `${baseUrl}/api/properties?minPrice=${minPrice}&beds=${beds}`
  );

  assert.equal(response.status, 200);

  const body = await response.json();

  const [rows] = await pool.execute(
    `
      SELECT COUNT(*) AS total
      FROM rets_property
      WHERE L_SystemPrice >= ?
        AND L_Keyword2 >= ?
    `,
    [minPrice, beds]
  );

  assert.equal(body.total, Number(rows[0].total));
});

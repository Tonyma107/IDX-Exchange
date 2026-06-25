# IDX Exchange Property Search

An individual internship project that builds a Zillow/Redfin-style property search application backed by local MLS data.

## Project objectives

- Build a searchable and filterable property listings experience
- Provide pagination and property detail pages
- Display property photos, maps, and open-house schedules
- Build a Node.js/Express REST API between React and MySQL
- Practice validation, error handling, testing, indexing, and deployment

## Architecture

```text
React frontend (port 3000)
        |
        v
Express REST API (port 5000)
        |
        v
MySQL 8 in Docker (port 3306)
```

React must never connect directly to MySQL. All database access goes through the Express API.

## Current progress

### Week 1

- Local MySQL 8 container setup
- `rets` database created
- `rets_property` and `rets_openhouse` imported and verified

### Week 2

- Node/Express backend initialized
- MySQL connection pool created with `mysql2/promise`
- `GET /api/health` implemented
- Development auto-reload configured with Nodemon
- Environment variables excluded from Git

## Repository structure

```text
IDX-Exchange/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── routes/health.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── docs/
│   └── data-dictionary-notes.md
├── .gitignore
├── WEEK2_CHECKLIST.md
└── README.md
```

## Prerequisites

- Node.js LTS and npm
- Docker Desktop
- Git
- The provided `rets_property.sql` and `rets_openhouse.sql` files stored locally, outside Git tracking

## 1. Start MySQL in Docker

Choose a local password and use the same value later in `backend/.env`.

```bash
docker run \
  --name idx-mysql-local \
  --restart unless-stopped \
  -e MYSQL_ROOT_PASSWORD=YOUR_LOCAL_PASSWORD \
  -e MYSQL_DATABASE=rets \
  -p 3306:3306 \
  -d mysql:8.0
```

Confirm that MySQL has finished starting:

```bash
docker ps
docker logs idx-mysql-local
```

## 2. Import the SQL files

Use the absolute path to each downloaded file. There is no space between `-p` and the password.

```bash
docker exec -i idx-mysql-local \
  mysql -uroot -pYOUR_LOCAL_PASSWORD rets \
  < /absolute/path/to/rets_property.sql

docker exec -i idx-mysql-local \
  mysql -uroot -pYOUR_LOCAL_PASSWORD rets \
  < /absolute/path/to/rets_openhouse.sql
```

Do not copy the SQL files into Git-tracked folders.

## 3. Verify the database

```bash
docker exec -it idx-mysql-local mysql -uroot -pYOUR_LOCAL_PASSWORD rets
```

Then run:

```sql
SHOW TABLES;
SELECT COUNT(*) FROM rets_property;
SELECT COUNT(*) FROM rets_openhouse;
DESCRIBE rets_property;
DESCRIBE rets_openhouse;
SELECT L_ListingID, L_Address, L_City, L_SystemPrice
FROM rets_property
LIMIT 5;
```

Exit MySQL with:

```sql
exit;
```

## 4. Configure and run the backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and enter the same MySQL password used when the Docker container was created.

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The API should run at `http://localhost:5000`.

## 5. Test the health endpoint

With MySQL running:

```bash
curl -i http://localhost:5000/api/health
```

Expected JSON:

```json
{
  "status": "ok",
  "database": "connected"
}
```

Test the failure path without stopping the Node server:

```bash
docker stop idx-mysql-local
curl -i http://localhost:5000/api/health
docker start idx-mysql-local
```

The stopped-database request should return HTTP 500 with JSON indicating that the database is disconnected, and the Express process should remain running.

## Security and data rules

- Never commit `.env`
- Never commit database passwords, API keys, raw CSV files, or SQL source files
- Use parameterized SQL queries for later endpoints
- Commit code, documentation, schema notes, and tests only

## Weekly workflow

Before every team meeting:

```bash
git status
git add .
git commit -m "Complete Week 2 backend health check"
git push origin main
```

Review `git status` before committing to make sure no secrets or raw data are included.

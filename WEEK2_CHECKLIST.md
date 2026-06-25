# Week 2 Checkpoint

## Repository
- [ ] Repository is public
- [ ] Teammates are added as collaborators
- [ ] `.env`, SQL files, CSV files, and raw data are ignored
- [ ] Latest work is pushed before the weekly meeting

## Week 1 database
- [ ] `docker ps` shows `idx-mysql-local`
- [ ] `SHOW TABLES;` shows `rets_property` and `rets_openhouse`
- [ ] Both tables have non-zero row counts
- [ ] `DESCRIBE rets_property;` and `DESCRIBE rets_openhouse;` work

## Week 2 backend
- [ ] `npm run dev` starts the API on port 5000
- [ ] `GET /api/health` returns HTTP 200 while MySQL is running
- [ ] `GET /api/health` returns HTTP 500 without crashing while MySQL is stopped
- [ ] Nodemon restarts the server after a source file is saved
- [ ] `.env` does not appear in `git status`

## Be ready to explain
- [ ] What a Docker container is
- [ ] Why MySQL runs in Docker
- [ ] What a database connection pool is
- [ ] Why one new database connection per request is inefficient
- [ ] GET vs POST vs PUT vs DELETE
- [ ] HTTP 400 vs 404 vs 500

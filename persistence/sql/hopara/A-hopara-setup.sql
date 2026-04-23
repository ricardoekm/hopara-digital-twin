-- The A prefix is important so the file runs before the migrations (postgres sort by file name)
CREATE SCHEMA AUTHORIZATION hopara;

ALTER DEFAULT PRIVILEGES IN SCHEMA hopara grant all on tables to hopara;

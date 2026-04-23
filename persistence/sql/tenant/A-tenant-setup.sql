CREATE USER app WITH PASSWORD 'app';
CREATE USER dataset WITH PASSWORD 'dataset';
CREATE USER hopara_io WITH PASSWORD 'hopara_io';

GRANT hopara_io to hopara;
CREATE SCHEMA AUTHORIZATION hopara_io;

ALTER DEFAULT PRIVILEGES IN SCHEMA hopara_io grant all on tables to hopara_io;
-- during the docker build for some reason the tables are being created on public schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public grant all on tables to hopara_io;

ALTER ROLE hopara_io SET statement_timeout TO '60s';

SET search_path TO hopara_io;
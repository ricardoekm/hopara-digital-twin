CREATE UNIQUE INDEX hp_tables_ds ON hp_tables (name,data_source_name);
ALTER TABLE hp_views ADD COLUMN write_mode varchar(32);
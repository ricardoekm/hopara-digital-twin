ALTER TABLE hp_columns DROP COLUMN table_id;
ALTER TABLE hp_views DROP CONSTRAINT IF EXISTS fk_table;
DROP TABLE hp_tables;
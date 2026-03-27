ALTER TABLE hp_views ADD COLUMN view_join varchar(512);
ALTER TABLE hp_views ADD CONSTRAINT fk_view_join FOREIGN KEY (view_join) REFERENCES hp_views (id);
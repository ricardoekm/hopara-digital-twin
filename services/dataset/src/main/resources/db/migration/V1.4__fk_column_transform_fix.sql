ALTER TABLE hp_columns DROP CONSTRAINT fk_transform;
ALTER TABLE hp_columns ADD CONSTRAINT fk_transform FOREIGN KEY (transform_id) REFERENCES hp_transforms (id) ON DELETE CASCADE;
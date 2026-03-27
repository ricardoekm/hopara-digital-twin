ALTER TABLE hp_views ADD COLUMN upsert boolean;
UPDATE hp_views SET upsert = true WHERE update_mode = 'UPSERT';
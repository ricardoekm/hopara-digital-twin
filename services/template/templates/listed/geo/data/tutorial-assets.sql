-- We can always force recreate tutorial tables
DROP TABLE IF EXISTS tutorial_assets CASCADE;

CREATE TABLE tutorial_assets (
    asset_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text,
    temperature float8
);

DELETE FROM tutorial_assets;
INSERT INTO tutorial_assets(name, temperature) VALUES
('Freezer A', -10.5),
('Freezer B', -20.4),
('Microscope', 10.2),
('Centrifuge', 25.1);
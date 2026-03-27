CREATE TABLE IF NOT EXISTS geo_floorplans (
    floorplan_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text,
    hopara_scope text,
    tenantId text
);

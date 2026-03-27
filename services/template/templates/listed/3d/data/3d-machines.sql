CREATE TABLE IF NOT EXISTS threed_machines (
    machine_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text,
    hopara_scope text,
    tenantId text
);
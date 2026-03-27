CREATE TABLE IF NOT EXISTS iwb_backgrounds (
    background_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text,
    hopara_scope text,
    tenantId text
);

CREATE TABLE IF NOT EXISTS iwb_lines (
    line_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text,
    hopara_scope text,
    tenantId text
);

CREATE TABLE IF NOT EXISTS iwb_images (
    image_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text,
    hopara_scope text,
    tenantId text
);
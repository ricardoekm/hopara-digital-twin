CREATE TABLE IF NOT EXISTS wb_polygons (
    polygon_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text,
    hopara_scope text,
    tenantId text
);

CREATE TABLE IF NOT EXISTS wb_texts (
    text_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text,
    hopara_scope text,
    tenantId text
);

CREATE TABLE IF NOT EXISTS wb_lines (
    line_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text,
    hopara_scope text,
    tenantId text
);

CREATE TABLE IF NOT EXISTS wb_images (
    image_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text,
    hopara_scope text,
    tenantId text
);
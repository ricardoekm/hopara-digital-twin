CREATE TABLE images_polygons (
    library TEXT NOT NULL,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    id INTEGER,
    polygon GEOMETRY,
    PRIMARY KEY (library, name, version, id)
);

CREATE INDEX idx_images_polygons_library_name_version ON images_polygons (library, name, version);

CREATE INDEX idx_images_polygons_polygon ON images_polygons USING GIST (polygon);
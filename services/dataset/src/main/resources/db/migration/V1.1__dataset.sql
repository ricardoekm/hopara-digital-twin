-- -------- DATA SOURCES
CREATE TABLE hp_data_sources (
    name varchar(255),
    username varchar(255),
    schema varchar(255),
    database varchar(255),
    server varchar(255),
    type varchar(255),
    PRIMARY KEY(name)
);

-- -------- TABLES
CREATE TABLE hp_tables (
    id varchar(512),
    name varchar(255),
    data_source_name varchar(255),
    PRIMARY KEY(id),
    CONSTRAINT fk_ds FOREIGN KEY(data_source_name) REFERENCES hp_data_sources(name) ON DELETE CASCADE
);

-- -------- VIEWS
CREATE TABLE hp_views (
    id varchar(512),
    data_source_name varchar(255),
    write_table_name varchar(255),
    write_id_column_name varchar(255),
    referenced_table_names varchar(255)[],
    name varchar(255),
    query text,
    filter_tables boolean,
    PRIMARY KEY(id),
    CONSTRAINT fk_ds FOREIGN KEY(data_source_name) REFERENCES hp_data_sources(name) ON DELETE CASCADE
);

-- -------- COLUMNS
CREATE TABLE hp_columns (
    name varchar(255),
    type varchar(255),
    type_param varchar(255),
    searchable boolean,
    table_id varchar(512),
    view_id varchar(512),
    top_values text[],
    min_x numeric,
    max_x numeric,
    min_y numeric,
    max_y numeric,
    percentiles numeric[],
    CONSTRAINT fk_table FOREIGN KEY(table_id) REFERENCES hp_tables(id) ON DELETE CASCADE,
    CONSTRAINT fk_view FOREIGN KEY(view_id) REFERENCES hp_views(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX hp_columns_table ON hp_columns (name,table_id);
CREATE UNIQUE INDEX hp_columns_view ON hp_columns (name,view_id);
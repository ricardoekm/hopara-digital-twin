CREATE TABLE hp_transforms (
    id varchar(512),
    type varchar(64),
    view_id varchar(512),
    params jsonb,
    PRIMARY KEY(id),
    CONSTRAINT fk_view FOREIGN KEY(view_id) REFERENCES hp_views(id) ON DELETE CASCADE
);

ALTER TABLE hp_columns ADD COLUMN transform_id varchar(512);
ALTER TABLE hp_columns ADD CONSTRAINT fk_transform FOREIGN KEY (transform_id) REFERENCES hp_transforms (id);
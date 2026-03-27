-- We can always force recreate tutorial tables
DROP TABLE IF EXISTS tutorial_rooms CASCADE;

CREATE TABLE tutorial_rooms (
    room_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text,
    alerting boolean,
    temperature float8
);

DELETE FROM tutorial_rooms;
INSERT INTO tutorial_rooms(name, temperature, alerting) VALUES
('Room 1', 10, false),
('Room 2', 20, false),
('Room 3', 30, true);
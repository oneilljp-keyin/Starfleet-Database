CREATE DATABASE StarfleetDatabase;
-- set extension to use uuid --
CREATE extension IF NOT EXISTS uuid - ossp;
-- Create users table
CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR NOT NULL,
  user_email VARCHAR NOT NULL,
  user_password VARCHAR NOT NULL
);
INSERT INTO users (user_name, user_email, user_password)
VALUES ('Admin', '', true);
CREATE TABLE alliances (
  alliance_id SERIAL PRIMARY KEY,
  name varchar,
  ally boolean
);
CREATE TABLE planets (
  planet_id SERIAL PRIMARY KEY,
  name varchar,
  alliance_id int,
  first_contact date,
  FOREIGN KEY (alliance_id) REFERENCES alliances (alliance_id)
);
CREATE TABLE species (
  species_id SERIAL PRIMARY KEY,
  name varchar,
  planet_id int,
  ufp_member boolean,
  FOREIGN KEY (planet_id) REFERENCES planets (planet_id)
);
CREATE TABLE personnel (
  personnel_id SERIAL PRIMARY KEY,
  surname varchar,
  first varchar,
  middle varchar,
  dob date,
  dob_note varchar,
  dod date,
  dod_note varchar,
  species_id varchar,
  serial varchar,
  notes text
);
CREATE TABLE starship_class (class_id SERIAL PRIMARY KEY, name varchar);
CREATE TABLE starships (
  starship_id int PRIMARY KEY,
  name varchar,
  prototype boolean,
  registry varchar,
  class_id int,
  launch date,
  launch_note varchar,
  decomm date,
  decomm_note varchar,
  destruct date,
  destruct_note varchar,
  notes text,
  FOREIGN KEY (class_id) REFERENCES starship_class (class_id)
);
CREATE TABLE locations (
  location_id SERIAL PRIMARY KEY,
  name varchar
);
CREATE TABLE rank (
  rank_id SERIAL PRIMARY KEY,
  label varchar,
  enlisted boolean,
  commissioned boolean
);
-- possible replacement for promotions, assignments and events
CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  event_type varchar NOT NULL,
  personnel_id int NOT NULL,
  rank_id int,
  starship_id int,
  location_id int,
  position varchar,
  event_date DATE NOT NULL,
  event_date_note VARCHAR,
  stardate decimal(16, 6),
  notes text,
  FOREIGN KEY (personnel_id) REFERENCES personnel (personnel_id),
  FOREIGN KEY (starship_id) REFERENCES starships (starship_id),
  FOREIGN KEY (location_id) REFERENCES locations (location_id),
  FOREIGN KEY (rank_id) REFERENCES rank (rank_id)
);
-- view to replace all foreign keys with proper text
CREATE OR REPLACE VIEW officer_history AS
SELECT ev.event_id,
  ev.event_type,
  ra.label,
  ss.name as ss_name,
  ss.registry,
  ss.prototype,
  loc.name as loc_name,
  ev.position,
  ev.event_date,
  ev.event_date_note,
  ev.stardate,
  ev.notes
FROM events ev
  JOIN starships ss USING (starship_id)
  JOIN locations loc USING (location_id)
  JOIN rank ra USING (rank_id);
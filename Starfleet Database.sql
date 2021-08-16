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
  dod date,
  species_id int,
  serial varchar,
  notes longtext,
  FOREIGN KEY (species_id) REFERENCES species (species_id)
);
CREATE TABLE starship_class (class_id SERIAL PRIMARY KEY, name varchar);
CREATE TABLE starships (
  starship_id int PRIMARY KEY,
  name varchar,
  prototype boolean,
  registry varchar,
  class_id int,
  launch date,
  decomm date,
  destruct date,
  notes longtext,
  FOREIGN KEY (class_id) REFERENCES starship_class (class_id)
);
CREATE TABLE locations (
  location_id SERIAL PRIMARY KEY,
  name varchar
);
CREATE TABLE promotions (
  promotion_id SERIAL PRIMARY KEY,
  personnel_id int,
  rank_id int,
  date date,
  notes longtext,
  FOREIGN KEY (personnel_id) REFERENCES personnel (personnel_id),
  FOREIGN KEY (rank_id) REFERENCES rank (rank_id)
);
CREATE TABLE assignments (
  assignment_id SERIAL PRIMARY KEY,
  personnel_id int,
  starship_id int,
  location_id int,
  position varchar,
  date date,
  notes longtext,
  FOREIGN KEY (personnel_id) REFERENCES personnel (personnel_id),
  FOREIGN KEY (starship_id) REFERENCES starships (starship_id),
  FOREIGN KEY (location_id) REFERENCES locations (location_id)
);
CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  personnel_id int,
  starship_id int,
  location_id int,
  date date,
  notes longtext,
  FOREIGN KEY (personnel_id) REFERENCES personnel (personnel_id),
  FOREIGN KEY (starship_id) REFERENCES starships (starship_id),
  FOREIGN KEY (location_id) REFERENCES locations (location_id)
);
CREATE TABLE rank (
  rank_id SERIAL PRIMARY KEY,
  label varchar,
  enlisted boolean,
  commissioned boolean
);
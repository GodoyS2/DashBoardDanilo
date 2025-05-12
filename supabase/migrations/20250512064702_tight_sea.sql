/*
  # Initial Schema Setup

  1. New Tables
    - `people`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text, nullable)
      - `bio` (text, nullable)
      - `avatar` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, nullable)
      - `avatar` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `group_members`
      - `group_id` (uuid, references groups)
      - `person_id` (uuid, references people)
      - Primary key is (group_id, person_id)

    - `locations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `visited` (boolean)
      - `lat` (double precision)
      - `lng` (double precision)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `location_assignments`
      - `location_id` (uuid, references locations)
      - `group_id` (uuid, references groups, nullable)
      - `person_id` (uuid, references people, nullable)
      - At least one of group_id or person_id must be non-null

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to perform CRUD operations
*/

-- People table
CREATE TABLE people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  bio text,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE people ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all people"
  ON people
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert people"
  ON people
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update people"
  ON people
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete people"
  ON people
  FOR DELETE
  TO authenticated
  USING (true);

-- Groups table
CREATE TABLE groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all groups"
  ON groups
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert groups"
  ON groups
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update groups"
  ON groups
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete groups"
  ON groups
  FOR DELETE
  TO authenticated
  USING (true);

-- Group members junction table
CREATE TABLE group_members (
  group_id uuid REFERENCES groups ON DELETE CASCADE,
  person_id uuid REFERENCES people ON DELETE CASCADE,
  PRIMARY KEY (group_id, person_id)
);

ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all group members"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage group members"
  ON group_members
  FOR ALL
  TO authenticated
  USING (true);

-- Locations table
CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  visited boolean DEFAULT false,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all locations"
  ON locations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert locations"
  ON locations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update locations"
  ON locations
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete locations"
  ON locations
  FOR DELETE
  TO authenticated
  USING (true);

-- Location assignments junction table
CREATE TABLE location_assignments (
  location_id uuid REFERENCES locations ON DELETE CASCADE,
  group_id uuid REFERENCES groups ON DELETE CASCADE,
  person_id uuid REFERENCES people ON DELETE CASCADE,
  CONSTRAINT at_least_one_assignment CHECK (
    (group_id IS NOT NULL) OR (person_id IS NOT NULL)
  ),
  UNIQUE (location_id, group_id, person_id)
);

ALTER TABLE location_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all location assignments"
  ON location_assignments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage location assignments"
  ON location_assignments
  FOR ALL
  TO authenticated
  USING (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_people_updated_at
  BEFORE UPDATE ON people
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
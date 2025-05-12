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
CREATE TABLE public.people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  bio text,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to people"
  ON public.people
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Groups table
CREATE TABLE public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to groups"
  ON public.groups
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Group members junction table
CREATE TABLE public.group_members (
  group_id uuid REFERENCES public.groups ON DELETE CASCADE,
  person_id uuid REFERENCES public.people ON DELETE CASCADE,
  PRIMARY KEY (group_id, person_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to group_members"
  ON public.group_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Locations table
CREATE TABLE public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  visited boolean DEFAULT false,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to locations"
  ON public.locations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Location assignments junction table
CREATE TABLE public.location_assignments (
  location_id uuid REFERENCES public.locations ON DELETE CASCADE,
  group_id uuid REFERENCES public.groups ON DELETE CASCADE,
  person_id uuid REFERENCES public.people ON DELETE CASCADE,
  CHECK (group_id IS NOT NULL OR person_id IS NOT NULL),
  PRIMARY KEY (location_id, COALESCE(group_id, '00000000-0000-0000-0000-000000000000'), COALESCE(person_id, '00000000-0000-0000-0000-000000000000'))
);

ALTER TABLE public.location_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to location_assignments"
  ON public.location_assignments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update timestamps trigger
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
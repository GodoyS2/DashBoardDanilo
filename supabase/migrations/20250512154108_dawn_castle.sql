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
CREATE TABLE IF NOT EXISTS public.people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  bio text,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
  ON public.people
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON public.people
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON public.people
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for authenticated users"
  ON public.people
  FOR DELETE
  TO authenticated
  USING (true);

-- Groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
  ON public.groups
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON public.groups
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON public.groups
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for authenticated users"
  ON public.groups
  FOR DELETE
  TO authenticated
  USING (true);

-- Group members junction table
CREATE TABLE IF NOT EXISTS public.group_members (
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
  person_id uuid REFERENCES public.people(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, person_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
  ON public.group_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON public.group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
  ON public.group_members
  FOR DELETE
  TO authenticated
  USING (true);

-- Locations table
CREATE TABLE IF NOT EXISTS public.locations (
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

CREATE POLICY "Enable read access for authenticated users"
  ON public.locations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON public.locations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON public.locations
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for authenticated users"
  ON public.locations
  FOR DELETE
  TO authenticated
  USING (true);

-- Location assignments junction table
CREATE TABLE IF NOT EXISTS public.location_assignments (
  location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE,
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
  person_id uuid REFERENCES public.people(id) ON DELETE CASCADE,
  CHECK (
    (group_id IS NOT NULL AND person_id IS NULL) OR
    (group_id IS NULL AND person_id IS NOT NULL)
  ),
  UNIQUE (location_id, COALESCE(group_id, '00000000-0000-0000-0000-000000000000'), COALESCE(person_id, '00000000-0000-0000-0000-000000000000'))
);

ALTER TABLE public.location_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
  ON public.location_assignments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON public.location_assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
  ON public.location_assignments
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_people_updated_at
  BEFORE UPDATE ON people
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();